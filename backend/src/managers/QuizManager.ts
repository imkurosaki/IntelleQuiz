import { Socket } from "socket.io";
import { Problem, Quiz } from "../Quiz";
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
   points: number;
   image: string;
}

// timer 10 seconds to answer the problems
export const MAX_TIME_SEC = 10;
const MAXPOINTS = 200;

export class QuizManager {
   public admin?: string;
   private rooms: Room[];

   constructor() {
      this.rooms = [];
   }

   findRoom(roomId: string) {
      const room = this.rooms.find((room: any) => room.id === roomId);
      if (!room) {
         return {
            room: null,
            error: "Room doesn't exist"
         };
      }
      return {
         room,
         error: null
      };
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

   addUser(roomId: string, username: string, socket: Socket) {
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

      // temporarily added this for avatar
      const randomNumber = Math.floor(Math.random() * 7) + 1;
      const id: string = uuidv4()
      room.users.push({
         id,
         username: username || "",
         points: 0,
         image: randomNumber.toString(),
      })
      socket.join(roomId);
      IoManager.io.to(roomId).emit("participants", {
         participants: room.users
      });
      return {
         id,
         roomId: room.id,
         status: room.status,
         problems: room.quiz.getQuiz()
      };
   }

   addQuiz(roomId: string, title: string, options: string[], answer: number, countdown: number) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }
      const quiz = room.quiz;
      quiz.addQuiz(roomId, title, options, answer, countdown);
   }

   getQuiz(roomId: string) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }
      return room.quiz;
   }

   submitAnswer(userId: string, roomId: string, problemId: string, answer: number, countdown: number) {
      const endTime = new Date().getTime();
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }
      const problem = room.quiz.getQuiz().find((problem: Problem) => problem.id === problemId);
      if (problem?.answer === answer) {
         const user = room.users.find((user: User) => user.id === userId);
         if (!user) {
            console.log("User is not found");
            return;
         }
         user.points += this.calculatePoints(room.quiz.startTime, endTime, countdown);
      }
   }

   calculatePoints(startTime: number, endTime: number, countdown: number) {
      const durationInMinutes = endTime - startTime;
      const durationInSeconds = durationInMinutes / 1000;
      const points = durationInSeconds > countdown ? 0 :
         MAXPOINTS * (1 - (durationInSeconds / countdown));

      return Math.round(points * 1000) / 1000;
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

      if (room.status !== "waiting") {
         return {
            error: "You can't re-start the quiz"
         };
      }
      console.log(problem)
      room.status = Status.Started;
      room.quiz.startTime = new Date().getTime();

      IoManager.io.to(roomId).emit("problem", {
         problem,
         status: room.status
      });
      return problem;
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
      room.quiz.startTime = new Date().getTime();
      IoManager.io.to(roomId).emit("problem", {
         problem,
         status: room.status
      });
      return problem;
   }

   endQuiz(roomId: string) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }

      room.status = Status.Finished;
      IoManager.io.to(roomId).emit("end", {
         status: room.status,
         leaderboard: this.leaderboard(room),
      });
   }

   getLeaderboard(roomId: string, countdown: number) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }

      setTimeout(() => {
         // const leaderboard = room.users.sort((a, b) => a.points - b.points).reverse();
         IoManager.io.to(roomId).emit("leaderboard", {
            leaderboard: this.leaderboard(room),
            status: "leaderboard",
         });
      }, countdown * 1000)
   }

   private leaderboard(room: Room) {
      return room.users.sort((a, b) => a.points - b.points).reverse();
   }
}
