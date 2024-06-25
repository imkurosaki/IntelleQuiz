import { Socket } from "socket.io";
import jwt from "jsonwebtoken"
import prisma from "../db";

interface DecodeToken {
   id: string,
}

declare module 'socket.io' {
   interface Socket {
      decoded: DecodeToken;
   }
}

export const authMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
   console.log('authMiddleware')
   const tokenToVerify: string = socket.handshake.auth.token?.split("Bearer ")[1];

   console.log(tokenToVerify)
   if (!tokenToVerify) {
      return next(new Error('Unauthorized token'));
   }

   try {
      if (!process.env.JWT_SECRET) {
         console.error("No JWT_SECRET in the env");
         return;
      }

      const decodedPayload: any = jwt.verify(tokenToVerify, process.env.JWT_SECRET);

      if (!decodedPayload.adminId) {
         return next(new Error('Unauthorized token'));
      }

      const isAdminIdExist: { id: string } | null = await prisma.admin.findFirst({
         where: {
            id: decodedPayload.adminId
         },
         select: {
            id: true
         }
      })

      if (!isAdminIdExist) {
         return next(new Error('Unauthorized token'))
      }

      socket.decoded = { id: isAdminIdExist.id }
      next();
   } catch (err: any) {
      return next(new Error('Unauthorized token'));
   }
}

