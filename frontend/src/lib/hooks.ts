import { Socket, SocketOptions, io } from 'socket.io-client';

interface CustomSocket extends Socket {
   auth: {
      token: string;
   }
}

let socket: CustomSocket | null = null;

export const useSocket = (token: string | null): Socket => {
   if (!socket || (token && socket.auth.token !== token)) {
      // Disconnect existing socket if token changes
      if (socket) {
         socket.disconnect();
         socket = null;
      }

      if (token) {
         const socketOptions: SocketOptions = {
            auth: {
               token: token
            }
         };

         socket = io("ws://localhost:3000", socketOptions) as CustomSocket;

         socket.on('connect', () => {
            console.log("Connected to server");
         })
      }
   }
   return socket!;
}
