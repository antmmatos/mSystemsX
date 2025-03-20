"use server";

import { signIn } from "@/lib/auth";

export async function authenticate(formData: FormData) {
    try {
        await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,
        });
        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error: {
                message: (error as Error).message,
                name: (error as Error).name,
            },
        };
    }
}
