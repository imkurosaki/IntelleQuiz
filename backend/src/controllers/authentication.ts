import { Response, Request } from 'express';
import { generateToken } from '../lib/generateToken';

const handleSocialSignIn = async (req: any, res: Response) => {
   try {
      console.log("handleSocialSignIn " + req.user);
      const userId = req.user?.id;

      return res
         .status(200)
         .cookie('token', `Bearer ${generateToken({ userId: userId })}`)
         .redirect('http://localhost:5174/room');
   } catch (e: any) {
      console.log(e);
   }
}

const getCurrentUser = async (req: Request, res: Response) => {
   const user: any = req.user;
   return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      image: user.image
   });
}

export const authController = {
   handleSocialSignIn,
   getCurrentUser
};
