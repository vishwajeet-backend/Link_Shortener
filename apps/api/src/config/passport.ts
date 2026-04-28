import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { env } from "./env";

export type GoogleProfile = {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL
    },
    (_accessToken, _refreshToken, profile: Profile, done) => {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        done(new Error("Google account email is required for authentication"));
        return;
      }

      const mappedProfile: GoogleProfile = {
        googleId: profile.id,
        email: email.toLowerCase(),
        name: profile.displayName || email.split("@")[0],
        avatarUrl: profile.photos?.[0]?.value
      };

      done(null, mappedProfile as unknown as Express.User);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as Express.User));

export { passport };
