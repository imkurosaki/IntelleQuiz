import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import prisma from '../db';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   const token = req.headers['authorization']?.split("%20")[1];

   if (!token) {
      res.status(411).json({ message: "Access Denied" });
      return
   }

   try {
      const decodedPayload: any = jwt.verify(token, process.env.JWT_SECRET || "no-secret")

      if (!decodedPayload.adminId) {
         throw new Error;
      }

      const user: any = await prisma.admin.findUnique({
         where: {
            id: decodedPayload.adminId
         }
      });

      if (!user) {
         throw new Error("User doesn't exist");
      }
      req.user = user;
      next();
   } catch (e: any) {
      res.status(411).json({
         message: "Unauthorized token"
      })
   }
}
