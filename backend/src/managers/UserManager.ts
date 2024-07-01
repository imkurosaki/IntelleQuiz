import { Socket } from "socket.io";
import { AdminManager } from "./AdminManager";
import prisma from "../db";
import { ParticipantManager } from "./ParticipantManager";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Leaderboard } from "../lib/types/types";

export class UserManager {
   private adminManager;
   private participantManager;

   constructor() {
      this.adminManager = new AdminManager;
      this.participantManager = new ParticipantManager;
   }

   addUser(socket: Socket) {
      socket.on("RegisterAdmin", async ({ username, password }: {
         username: string,
         password: string,
      }, callback: CallableFunction) => {
         if (!username && !password) {
            socket.emit("error", {
               error: "Please enter username && password"
            })
            return;
         }
         const responseData = await this.adminManager.registerAdmin(username, password);
         callback(responseData);
      })

      socket.on("SigninAdmin", async ({ username, password }: {
         username: string,
         password: string
      }) => {
         this.adminManager.signinAdmin(username, password, socket)
      });

      socket.on("addRoom", ({ roomName }: {
         roomName: string,
      }, callback: CallableFunction) => {
         // middleware
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            this.adminManager.addRoom(roomName, socket);
         });
      })

      socket.on("roomId", async ({ roomId }: {
         roomId: string
      }, callback: CallableFunction) => {
         const response = await this.adminManager.getRoom(socket, roomId)
         return callback(response);
      })

      socket.on("getMyRooms", ({ }, callback: CallableFunction) => {
         // middleware
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            const room = await this.adminManager.getRooms(socket);
            return callback(room);
         });
      });

      socket.on("deleteRoom", ({ roomId }: { roomId: string }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            const result: {
               status: string,
               message: string
            } = await this.adminManager.deleteRoom(socket, roomId);
            return callback(result)
         })
      })

      socket.on("addProblem", ({ quizId, title, options, answer, countdown }: {
         title: string,
         options: string[],
         answer: number,
         countdown: number,
         quizId: string,
      }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            this.adminManager.addProblem(quizId, title, options, answer, countdown, socket)
         })
      })

      socket.on("start", ({ roomId, quizId }: {
         roomId: string,
         quizId: string,
      }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            this.adminManager.start(roomId, quizId, socket);
         });
      })

      socket.on("start-automatically", async ({ roomId, quizId }: {
         roomId: string,
         quizId: string
      }) => {
         const SECONDS_DELAY: number = 10;
         let COUNTDOWN_TIMER: number = 0;

         socket.emit("operation", {
            operation: "start-automatically"
         });

         const noOfProblems: number = await this.adminManager.getNoOfProblems(roomId, quizId, socket);

         for (let i = 0; i < noOfProblems; i++) {
            if (i === 0) {
               //begin the quiz

               COUNTDOWN_TIMER = await this.adminManager.start(roomId, quizId, socket);
               this.adminManager.getLeaderboard(quizId, roomId, COUNTDOWN_TIMER);
            } else {
               COUNTDOWN_TIMER = await this.adminManager.next(roomId, quizId, socket);
               this.adminManager.getLeaderboard(quizId, roomId, COUNTDOWN_TIMER);
            }
            await new Promise(r => setTimeout(r, (COUNTDOWN_TIMER + SECONDS_DELAY) * 1000));
         }
         //end of the quiz
         await this.adminManager.endQuiz(roomId, quizId, socket);
      })

      socket.on("next", ({ roomId, quizId }: {
         roomId: string,
         quizId: string,
      }) => {
         this.adminManager.next(roomId, quizId, socket)
      })

      socket.on("end", ({ roomId, quizId }: {
         roomId: string,
         quizId: string
      }) => {
         this.adminManager.endQuiz(roomId, quizId, socket);
      })

      socket.on("GetLeaderboad", ({ quizId }: {
         roomId: string,
         quizId: string,
         countdown: number
      }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            const leaderboard: Leaderboard[] = await prisma.points.findMany({
               where: {
                  quizId: quizId
               },
               orderBy: {
                  points: 'desc'
               },
               select: {
                  points: true,
                  participant: {
                     select: {
                        id: true,
                        username: true,
                        image: true
                     }
                  }
               }
            })
            return callback(leaderboard);
         });
      })

      socket.on("disconnect", () => {
         console.log("Admin is disconnected");
      })

      socket.on("JoinRoom", ({ roomId }: {
         participantId: string,
         roomId: string,
      }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            const result = await this.participantManager.joinRoom(roomId, socket);
            return callback(result);
         });
      })

      socket.on("NoOfProblems", ({ roomId, quizId }: {
         roomId: string,
         quizId: string
      }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            const problemsLength = await this.adminManager.getNoOfProblems(roomId, quizId, socket);
            return callback(problemsLength);
         })
      })

      socket.on("Submit", ({ pointsId, roomId, quizId, problemId, answer }: {
         pointsId: string,
         roomId: string,
         quizId: string,
         problemId: string,
         answer: number,
      }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            await this.participantManager.submitAnswer(pointsId, roomId, quizId, problemId, answer, socket);
         })
      })

      socket.on("GetRecentlyJoinedRooms", ({ }, callback: CallableFunction) => {
         authMiddleware(socket, async (err: any) => {
            if (err) {
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            const rooms = await this.participantManager.getRecentlyJoinedRooms(socket);
            return callback(rooms);
         })
      })

      socket.on("LeaveRoom", ({ roomId }: {
         roomId: string
      }) => {
         socket.leave(roomId);
      })
   }
}
