import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { queryOne } from "./db";
import type { User as DBUser } from "@/types";

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
        name: string;
        image?: string | null;
    }
    interface Session {
        user: User;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await queryOne<DBUser>(
                    "SELECT id, username, password_hash, name, image_url FROM users WHERE username = $1",
                    [credentials.username]
                );

                if (!user) {
                    return null;
                }

                const isValid = await compare(
                    credentials.password as string,
                    user.password_hash
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: String(user.id),
                    username: user.username,
                    name: user.name,
                    image: user.image_url,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.name = user.name;
                token.image = (user as any).image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.name = token.name as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
});
