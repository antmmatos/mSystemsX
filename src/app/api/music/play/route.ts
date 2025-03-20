import { DataStorage } from "@/lib/db";
import { Spotify } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json();
    if (
        !data.uri ||
        !data.name ||
        !data.album ||
        !data.artist ||
        !data.img ||
        !data.maxTime ||
        data.playing === undefined ||
        data.playing === null
    ) {
        return NextResponse.json(
            {
                success: false,
                message: "Missing parameter",
            },
            { status: 400 }
        );
    }
    try {
        if (data.playing) {
            await Spotify.MusicPlayer({
                playing: data.playing,
                uri: data.uri,
                name: data.name,
                album: data.album,
                artist: data.artist,
                img: data.img,
                time: 0,
                maxTime: data.maxTime,
            });
        } else {
            await Spotify.StopMusic();
        }
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { success: false, message: "Unable to play music" },
            { status: 400 }
        );
    }
}

let currentTrack = {
    playing: false,
    uri: "",
    name: "",
    album: "",
    artist: "",
    img: "",
    time: 0,
    maxTime: 0,
};

let queue: any;

async function updatePlaybackState(currentPlaybackState: any = null) {
    try {
        if (currentPlaybackState && !currentPlaybackState.is_playing) {
            queue = await DataStorage.QueryRecord(
                "SELECT * FROM queue ORDER BY `order` ASC",
                []
            );
            await DataStorage.SingleRecord(
                "INSERT INTO old_queue (music_uri, music_name, music_album, music_artist, music_img, music_time, old_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    currentPlaybackState.item.uri,
                    currentPlaybackState.item.name,
                    currentPlaybackState.item.album.name,
                    currentPlaybackState.item.artists[0].name,
                    currentPlaybackState.item.album.images[0].url,
                    currentPlaybackState.item.duration_ms,
                    queue[0]?.order || 0,
                ]
            );
            if (queue.length > 0) {
                const song = queue[0];
                await Spotify.MusicPlayer(
                    {
                        playing: true,
                        uri: song.music_uri,
                        name: song.music_name,
                        album: song.music_album,
                        artist: song.music_artist,
                        img: song.music_img,
                        time: 0,
                        maxTime: song.music_time,
                    },
                    true
                );
                await DataStorage.SingleRecord(
                    "DELETE FROM queue WHERE `order` = ?",
                    [song.order]
                );
            } else {
                await Spotify.StopMusic();
            }
        }
    } catch (error: any) {
        console.log(error);
    }
}

async function updateQueue() {
    queue = await DataStorage.QueryRecord(
        "SELECT * FROM queue ORDER BY `order` ASC",
        []
    );
}

export async function SOCKET(
    client: import("ws").WebSocket,
    request: import("http").IncomingMessage,
    server: import("ws").WebSocketServer
) {
    await updatePlaybackState();
    await updateQueue();

    const interval = setInterval(async () => {
        try {
            const currentPlaybackState =
                await Spotify.GetCurrentPlaybackState();
            if (
                currentPlaybackState &&
                currentPlaybackState.item
            ) {
                currentTrack = {
                    playing: currentPlaybackState.is_playing,
                    uri: currentPlaybackState.item.uri,
                    name: currentPlaybackState.item.name,
                    album: currentPlaybackState.item.album.name,
                    artist: currentPlaybackState.item.artists[0].name,
                    img: currentPlaybackState.item.album.images[0].url,
                    time: currentPlaybackState.progress_ms || 0,
                    maxTime: currentPlaybackState.item.duration_ms,
                };
            } else {
                await updatePlaybackState(currentPlaybackState);
            }
            await updateQueue();
        } catch (error) {
            console.log(error);
        }

        client.send(
            JSON.stringify({ success: true, track: currentTrack, queue })
        );
    }, 1000);

    client.on("close", () => clearInterval(interval));
}
