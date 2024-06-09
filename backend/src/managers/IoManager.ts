import { Server } from "socket.io";

export class IoManager {
   static io: Server;

   static getIo(httpServer: any) {
      if (!this.io) {
         this.io = new Server(httpServer, {
            cors: {
               origin: "*",
               methods: ["GET", "POST"]
            }
         });
      }
      return this.io;
   }
}
