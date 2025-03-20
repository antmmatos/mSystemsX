import { auth, signOut } from "@/lib/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
    const session = await auth();
    if (session) {
        signOut({
            redirect: false,
        });
    }
    return NextResponse.redirect(process.env.BASE_URL as string);
};
