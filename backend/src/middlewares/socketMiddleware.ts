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

export const socketMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
   const tokenToVerify: string = socket.handshake.auth.token?.split("Bearer ")[1];

   if (!tokenToVerify) {
      return next(new Error('Unauthorized token'));
   }

   try {
      if (!process.env.JWT_SECRET) {
         return;
      }

      const decodedPayload: any = jwt.verify(tokenToVerify, process.env.JWT_SECRET);

      if (!decodedPayload.userId) {
         return next(new Error('Unauthorized token'));
      }

      const isUserIdExist: { id: string } | null = await prisma.user.findFirst({
         where: {
            id: decodedPayload.userId
         },
         select: {
            id: true
         }
      })

      if (!isUserIdExist) {
         return next(new Error('Unauthorized token'))
      }

      socket.decoded = { id: isUserIdExist.id }
      next();
   } catch (err: any) {
      return next(new Error('Unauthorized token'));
   }
}

