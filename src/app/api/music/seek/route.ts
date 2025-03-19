import { Spotify } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    if (!data.percentage) {
        return NextResponse.json(
            {
                success: false,
                message: "Missing parameter",
            },
            { status: 400 }
        );
    }
    try {
        await Spotify.Seek(data.percentage);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: "Unable to seek music" },
            { status: 400 }
        );
    }
}
