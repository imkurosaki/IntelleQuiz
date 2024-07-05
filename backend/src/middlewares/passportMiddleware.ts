import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../db';

passport.serializeUser((user: any, done: (err: any, id?: string) => void) => {
   done(null, user.id);
});

passport.deserializeUser(async (id: string, next: any) => {
   try {
      const user = await prisma.user.findFirst({
         where: {
            id: id
         }
      });
      if (user) {
         next(null, user);
      } else {
         next(null, false, {
            message: "User doest not exist"
         })
      }
   } catch (e: any) {
      next(e);
   }
});

passport.use(new GoogleStrategy(
   {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
   },
   async (accessToken: string, refreshToken: string, profile: any, next: any) => {
      try {
         console.log("passport use " + profile._json.email)
         const user = await prisma.user.findUnique({
            where: {
               email: profile._json.email
            }
         });
         if (user) {
            if (user.signInType !== 'Google') {
               return next(null, false, {
                  message: "Invalid sign in type"
               })
            } else {
               console.log("out passport use has user exist")
               return next(null, user);
            }
         }

         const newUser = await prisma.user.create({
            data: {
               username: profile._json.name,
               email: profile._json.email,
               password: profile._json.sub,
               image: Math.floor(Math.random() * 7) + 1,
               signInType: 'Google'
            }
         });

         console.log("passport " + newUser)
         if (newUser) return next(null, newUser);
         else {
            return next(null, false, {
               message: "Error while registering the user"
            })
         }
      } catch (e: any) {
         console.log(e);
         return next(null, false, {
            message: "Error during Google authentication"
         })
      }
   }));

export default passport;
