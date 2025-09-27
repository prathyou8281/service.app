import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,       // from .env.local
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // from .env.local
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // required for encryption
  callbacks: {
    async signIn({ user }) {
      // 👇 Here you can connect to MySQL and store user info if needed
      // Example:
      // const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [user.email]);
      // if (!rows.length) {
      //   await db.query("INSERT INTO users (name, email) VALUES (?, ?)", [user.name, user.email]);
      // }
      return true; // allow login
    },
    async session({ session, token }) {
      // Attach the user id (from Google) to the session object
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
