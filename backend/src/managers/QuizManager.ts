import { Socket } from "socket.io";
import { Quiz } from "../Quiz";
import { v4 as uuidv4 } from 'uuid';
import { IoManager } from "./IoManager";

export enum Status {
   Waiting = "waiting",
   Started = "started",
   Ongoing = "ongoing",
   Finished = "finished",
}

export interface Room {
   id: string;
   admin: string;
   status: Status;
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
         status: Status.Waiting,
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
      console.log(room?.status)
      if (!room) {
         return { error: "Room doesn't exist" };
      }
      const user = room?.users.find((user: any) => user.username === username);
      if (user) {
         return { error: "User already in room" };
      }

      if (room.status === Status.Finished || room.status === Status.Ongoing || room.status === Status.Started) {
         return { error: `Quiz is ${room?.status}` }
      }

      room.users.push({
         id: uuidv4(),
         username: username || ""
      })
      return { status: room.status };
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

   answer() {

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
      room.status = Status.Started;
      IoManager.io.to(roomId).emit("problem", {
         problem,
         status: room.status
      });
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
      room.status = Status.Ongoing;
      IoManager.io.to(roomId).emit("problem", {
         problem,
         status: room.status
      });
   }

   endQuiz(roomId: string) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }

      room.status = Status.Finished;
      IoManager.io.to(roomId).emit("end", {
         status: room.status
      });
   }
}
