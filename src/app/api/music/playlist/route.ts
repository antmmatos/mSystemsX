import { Spotify } from "@/lib/spotify";
import { NextResponse } from "next/server";

export async function GET() {
    const defaultPlaylist = await Spotify.LoadDefaultPlaylist();
    return NextResponse.json(defaultPlaylist);
}
