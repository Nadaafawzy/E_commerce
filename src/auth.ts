import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    });

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
                        console.error("Auth API error:", errorData);
                        return null;
                    }

                    const data = await res.json();
                    console.log("Auth API response:", data);

                    if (data.status === "success" || data.message === "success") {
                        return {
                            id: data.user.email,
                            user: data.user,
                            token: data.token
                        }
                    }
                    console.log("Auth failed: invalid status/message", data);
                    return null;
                } catch (error) {
                    console.error("NextAuth authorize error:", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = (user as any).user;
                token.token = (user as any).token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = token.user as any;
                (session as any).token = token.token as string;
            }
            return session;
        },
    },
};