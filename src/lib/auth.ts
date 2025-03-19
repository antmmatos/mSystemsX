import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/utils/password";
import { DataStorage } from "./db";

class LoginError extends AuthError {
    constructor(message: string) {
        super(message);
        this.message = message;
    }
    override stack = "";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            authorize: async (credentials) => {
                const data = await DataStorage.SingleRecord(
                    "SELECT id, firstname, lastname, username, password FROM users WHERE username = ?",
                    [credentials.username as string]
                );
                if (!data || data.length <= 0) {
                    throw new LoginError("Invalid username or password");
                }
                if (
                    await verifyPassword(
                        credentials.password as string,
                        data.password
                    )
                ) {
                    return {
                        id: data.id,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        username: data.username,
                    };
                }
                throw new LoginError("Invalid username or password");
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
    },
    callbacks: {
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.firstname = token.firstname;
                session.user.lastname = token.lastname;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
            }
            return token;
        },
    },
});
