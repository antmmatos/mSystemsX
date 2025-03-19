import { DataStorage } from "@/lib/db";
import { Spotify } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function POST() {
    const old_queue = await DataStorage.SingleRecord(
        "SELECT * FROM old_queue ORDER BY `order` DESC LIMIT 1",
        []
    );
    if (old_queue) {
        const currentTrack = await Spotify.GetCurrentPlaybackState();
        if (currentTrack.item.uri !== "") {
            await DataStorage.SingleRecord(
                "INSERT INTO queue (`order`, music_uri, music_name, music_album, music_artist, music_img, music_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    old_queue.old_order,
                    currentTrack.item.uri,
                    currentTrack.item.name,
                    currentTrack.item.album.name,
                    currentTrack.item.artists[0].name,
                    currentTrack.item.album.images[0].url,
                    currentTrack.item.duration_ms,
                ]
            );
        }
        await DataStorage.SingleRecord("DELETE FROM old_queue WHERE `order` = ?", [
            old_queue.order,
        ]);
        console.log(old_queue);
        await Spotify.MusicPlayer(
            {
                playing: true,
                uri: old_queue.music_uri,
                name: old_queue.music_name,
                album: old_queue.music_album,
                artist: old_queue.music_artist,
                img: old_queue.music_img,
                time: 0,
                maxTime: old_queue.music_time,
            },
            true
        );
        return NextResponse.json({
            success: true,
            message: "Skipped to previous song",
        });
    } else {
        return NextResponse.json({
            success: false,
            message: "No previous song found",
        });
    }
}