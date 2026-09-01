// ====================================================================
// EN PROFILE — NextAuth v5 Setup
// Discord OAuth2 Provider & Server Verification
// ====================================================================
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "discord",
      name: "Discord",
      type: "oauth",
      authorization: {
        url: "https://discord.com/api/oauth2/authorize",
        params: { scope: "identify email guilds guilds.members.read" },
      },
      token: "https://discord.com/api/oauth2/token",
      userinfo: "https://discord.com/api/users/@me",
      clientId: process.env.DISCORD_CLIENT_ID || "demo-client-id",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "demo-client-secret",
      profile(profile) {
        return {
          id: profile.id,
          name: profile.global_name || profile.username,
          email: profile.email,
          image: profile.avatar
            ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
            : `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(profile.id) >> BigInt(22)) % BigInt(6))}.png`,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  secret: process.env.AUTH_SECRET || "default-secret-for-development-mode-12345",
  pages: {
    signIn: "/",
  },
});
