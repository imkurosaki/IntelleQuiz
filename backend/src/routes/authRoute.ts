import express from "express";
import passport from "passport";
import { authController } from "../controllers/authentication";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

const {
   handleSocialSignIn,
   getCurrentUser
} = authController;

router
   .route('/google')
   .get(passport.authenticate('google', { scope: ['profile', 'email'] }),
      (req, res) => res.send('redirecting to google....')
   );

router
   .route('/google/callback')
   .get(passport.authenticate('google'), handleSocialSignIn);

router
   .route('/getCurrentUser')
   .get(authMiddleware, getCurrentUser);

export {
   router
}
