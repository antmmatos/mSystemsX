import { Spotify } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const musicSearchData = request.nextUrl.searchParams.get("music");
    if (!musicSearchData) {
        return NextResponse.json({
            success: false,
            message: "No search data provided"
        });
    }
    const searchResults = await Spotify.SearchSong(musicSearchData);
    return NextResponse.json({
        success: true,
        data: searchResults
    });
}