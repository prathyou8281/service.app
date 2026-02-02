import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/login",
        error: "/login",
    },

    callbacks: {
        // 1️⃣ VERY IMPORTANT: signIn must be lightweight
        async signIn() {
            return true;
        },

        // 2️⃣ Backend sync MUST be in jwt
        async jwt({ token, user, account }) {
            // Runs only on first Google sign-in
            if (user && account?.provider === "google") {
                try {
                    console.log("🔵 Syncing Google user with backend...");

                    const res = await fetch(
                        "http://localhost:4000/api/auth/google-login",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: user.email,
                                name: user.name,
                                googleId: account.providerAccountId,
                                image: user.image,
                            }),
                        }
                    );

                    if (!res.ok) {
                        console.error("❌ Backend error:", res.status);
                        return token;
                    }

                    const data = await res.json();

                    if (data.success) {
                        token.id = data.user.id;
                        token.role = data.user.role;
                        token.accessToken = data.user.access_token;
                        token.phone = data.user.phone;
                    }
                } catch (err) {
                    console.error("❌ Backend sync failed:", err);
                }
            }

            return token;
        },

        // 3️⃣ Pass JWT → session
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).accessToken = token.accessToken;
                (session.user as any).phone = token.phone;
            }
            return session;
        },
    },

    debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
