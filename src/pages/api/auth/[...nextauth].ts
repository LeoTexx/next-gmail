import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope:
            "openid https://www.googleapis.com/auth/gmail.readonly  https://www.googleapis.com/auth/userinfo.email  https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        const { access_token } = account;
        token.accessToken = access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom accessToken
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
