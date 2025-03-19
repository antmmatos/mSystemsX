import { Spotify } from "@/lib/spotify";
import { NextRequest, NextResponse } from "next/server";
import { writeToJson } from "@/lib/file";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return NextResponse.json({
            success: true,
            auth: Spotify.IsAuthenticated,
        });
    }
    try {
        writeToJson("code", code);
        await Spotify.Authenticate(code);
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Unknown error authenticating with Spotify",
        });
    }
    return NextResponse.redirect(process.env.BASE_URL + "/dashboard");
}
