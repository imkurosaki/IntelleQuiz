import jwt from "jsonwebtoken";

export const generateToken = (payload: object): string => {
   if (!process.env.JWT_SECRET) {
      return "Error, please setup secret in env";
   }
   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
}
