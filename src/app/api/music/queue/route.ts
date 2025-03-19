import { DataStorage } from "@/lib/db";
import { Spotify } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        if (
            !data.uri ||
            !data.name ||
            !data.album ||
            !data.artist ||
            !data.img ||
            !data.maxTime
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing data parameter",
                },
                { status: 400 }
            );
        }
        let order = await DataStorage.ScalarRecord(
            "SELECT `order` FROM queue ORDER BY `order` desc",
            [],
            "order"
        );
        if (!order) {
            order = 0;
        }
        await DataStorage.QueryRecord(
            "INSERT INTO queue (`order`, music_uri, music_name, music_album, music_artist, music_img, music_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                order + 1,
                data.uri,
                data.name,
                data.album,
                data.artist,
                data.img,
                data.maxTime,
            ]
        );
        return NextResponse.json({
            success: true,
            queue: await DataStorage.QueryRecord(
                "SELECT * FROM queue ORDER BY `order` ASC",
                []
            ),
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Unknown error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    const track_data = await Spotify.GetCurrentPlaybackState();
    return NextResponse.json({
        success: true,
        queue:
            (await DataStorage.QueryRecord(
                "SELECT * FROM queue ORDER BY `order` ASC",
                []
            )) || [],
        isPlaying: track_data?.is_playing,
    });
}

export async function DELETE(request: NextRequest) {
    try {
        const order = request.nextUrl.searchParams.get("order");
        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing data parameter",
                },
                { status: 400 }
            );
        }
        await DataStorage.QueryRecord("DELETE FROM queue WHERE `order` = ?", [
            order,
        ]);
        return NextResponse.json({
            success: true,
            queue: await DataStorage.QueryRecord(
                "SELECT * FROM queue ORDER BY `order` ASC",
                []
            ),
        });
    } catch (error) {
        return NextResponse.json({ success: false });
    }
}
