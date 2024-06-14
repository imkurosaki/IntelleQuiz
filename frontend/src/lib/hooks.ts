import { Socket, io } from 'socket.io-client';

let socket: Socket | null = null;

export const useSocket = (): Socket => {
   if (!socket) {
      socket = io("ws://localhost:3000")

      socket.on('connect', () => {
         console.log("Connected to server");
      })
   }
   return socket;
}
