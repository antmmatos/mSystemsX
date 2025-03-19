import { DataStorage } from "@/lib/db";
import { Spotify } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function POST() {
    const queue = await DataStorage.SingleRecord("SELECT * FROM queue", []);
    if (queue) {
        const currentTrack = await Spotify.GetCurrentPlaybackState();
        if (currentTrack?.item?.uri !== "") {
            await DataStorage.SingleRecord(
                "INSERT INTO old_queue (music_uri, music_name, music_album, music_artist, music_img, music_time, old_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    currentTrack.item.uri,
                    currentTrack.item.name,
                    currentTrack.item.album.name,
                    currentTrack.item.artists[0].name,
                    currentTrack.item.album.images[0].url,
                    currentTrack.item.duration_ms,
                    queue.order || 0,
                ]
            );
        }
        await DataStorage.SingleRecord("DELETE FROM queue WHERE `order` = ?", [
            queue.order,
        ]);
        await Spotify.MusicPlayer(
            {
                playing: true,
                uri: queue.music_uri,
                name: queue.music_name,
                album: queue.music_album,
                artist: queue.music_artist,
                img: queue.music_img,
                time: 0,
                maxTime: queue.music_time,
            },
            true
        );
        return NextResponse.json({
            success: true,
            message: "Skipped to next song",
        });
    } else {
        return NextResponse.json({
            success: false,
            message: "No songs in queue",
        });
    }
}
