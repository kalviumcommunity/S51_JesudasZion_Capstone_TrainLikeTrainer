import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/db';
import User from '@/lib/models/User';

// Lives here rather than in the route file: App Router route modules are only
// meant to export HTTP handlers and route config, so `authOptions` needs its
// own module for other server code to import it.
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const conn = await connectToDatabase();
          if (conn) {
            const existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
              // New athletes start empty. Pre-filling a sport, a position and
              // 100 XP made every fresh account look like it had history.
              await User.create({
                name: user.name,
                email: user.email,
                image: user.image,
                googleId: profile?.sub,
                role: 'athlete',
                level: 'Beginner',
                streakDays: 1,
                xpPoints: 0,
                completedDrills: [],
                savedDrills: [],
              });
            } else {
              await User.updateOne(
                { email: user.email },
                { $set: { image: user.image, lastActiveDate: new Date() } }
              );
            }
          }
        } catch (err) {
          console.error('Error syncing Google user to MongoDB:', err);
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const conn = await connectToDatabase();
          if (conn) {
            const dbUser = await User.findOne({ email: session.user.email }).lean();
            if (dbUser) {
              session.user.id = dbUser._id.toString();
              session.user.primarySport = dbUser.primarySport;
              session.user.position = dbUser.position;
              session.user.xpPoints = dbUser.xpPoints;
              session.user.streakDays = dbUser.streakDays;
            }
          }
        } catch (e) {
          console.error('Session callback MongoDB fetch error:', e);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
