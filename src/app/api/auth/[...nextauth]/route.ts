import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/user/login", // custom login page
  },
  callbacks: {
    // ✅ No ESLint warnings (unused vars prefixed with _)
    async redirect({ _url, _baseUrl }: { _url: string; _baseUrl: string }) {
      return "/welcome"; // redirect after Google login
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
