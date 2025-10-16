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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      return "/welcome"; // redirect after Google login
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
