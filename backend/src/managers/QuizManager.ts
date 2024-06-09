import { Socket } from "socket.io";
import { Quiz } from "../Quiz";
import { v4 as uuidv4 } from 'uuid';
import { IoManager } from "./IoManager";

export interface Room {
   id: string;
   admin: string;
   quiz: Quiz;
   users: User[];
}

export interface User {
   id: string;
   username: string;
}

export class QuizManager {
   public admin?: string;
   private rooms: Room[];

   constructor() {
      this.rooms = [];
   }

   addRoom(roomId: string, admin: string) {
      const room = this.rooms.find((room: any) => room.id === roomId && room.admin === admin);
      if (room) {
         console.log("room is already exist " + roomId);
         return;
      }
      this.rooms.push({
         id: roomId,
         admin,
         quiz: new Quiz(roomId),
         users: [],
      })
      console.log("successfully added room " + this.rooms)
   }

   addAdmin(username: string) {
      if (!username) {
         console.log("No username")
         return;
      }
      this.admin = username;
      console.log(this.admin);
   }

   addUser(roomId: string, username?: string) {
      const room = this.rooms.find((room: Room) => room.id === roomId);
      if (!room) {
         return { error: "Room doesn't exist" };
      }
      const user = room?.users.find((user: any) => user.username === username);
      if (user) {
         return { error: "User already in room" };
      }

      room.users.push({
         id: uuidv4(),
         username: username || ""
      })
      // return room.quiz.getQuiz();
   }

   addQuiz(roomId: string, title: string, options: string[], answer: number) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }
      const quiz = room.quiz;
      quiz.addQuiz(roomId, title, options, answer);
   }

   getQuiz(roomId: string) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }
      return room.quiz;
   }

   start(roomId: string) {
      console.log(roomId)
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }

      const problem = room.quiz.start();
      if (!problem) {
         console.log("You don't have a problem yet.")
         return {
            error: "You don't have a problem yet."
         }
      }
      console.log(problem)
      IoManager.io.to(roomId).emit("problem", problem);
   }

   next(roomId: string) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }

      const problem = room.quiz.next();
      if (!problem) {
         console.log("You don't have a problem yet.")
         return {
            error: "You don't have a problem yet."
         }
      }
      IoManager.io.to(roomId).emit("problem", problem);
   }
}
