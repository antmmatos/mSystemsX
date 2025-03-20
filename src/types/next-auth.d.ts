import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            username: string;
            firstname: string;
            lastname: string;
        } & DefaultSession["user"];
    }
    interface User {
        username: string;
        firstname: string;
        lastname: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username: string;
        firstname: string;
        lastname: string;
    }
}
