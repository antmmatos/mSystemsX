import { DataStorage } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await DataStorage.QueryRecord("SELECT id, firstname, lastname, username FROM users", []);
    return NextResponse.json(data);
}