import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../modals/User.js";

export const connectPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        // will run after logged in
        // db comes here
        const user = await User.findOne({
          googleId: profile.id
        });
        // done - A verify function yields under one of three conditions: success, failure, or an error. if success, it attaches user to the req
        //     If the verify function finds a user to which the credential belongs, and that credential is valid, it calls the callback with the authenticating user:

        // return cb(null, user);
        // If the credential does not belong to a known user, or is not valid, the verify function calls the callback with false to indicate an authentication failure:

        // return cb(null, false);
        // If an error occurs, such as the database not being available, the callback is called with an error, in idiomatic Node.js style:

        // return cb(err);


        if (!user) {

          const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            photo: profile.photos[0].value,
          })

          return done(null, newUser);
        }
        else {
          return done(null, user);
        }
      })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

