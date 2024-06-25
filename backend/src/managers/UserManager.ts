import { Server, Socket } from "socket.io";
import { AdminManager, MAX_TIME_SEC, Room, Status } from "./AdminManager";
import { IoManager } from "./IoManager";
import { Problem, Quiz } from "../Quiz";
import prisma from "../db";
import { ParticipantManager } from "./ParticipantManager";
import { authMiddleware } from "../middlewares/authMiddleware";

export class UserManager {
   private adminManager;
   private participantManager;

   constructor() {
      this.adminManager = new AdminManager;
      this.participantManager = new ParticipantManager;
   }

   addUser(socket: Socket) {
      console.log("connected")
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
         console.log("outside middleware")
         authMiddleware(socket, async (err: any) => {
            console.log("pre middleware")
            if (err) {
               console.log(err);
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            this.adminManager.addRoom(roomName, socket);

            // const username = this.adminManager.admin;
            // const admin = await prisma.admin.findFirst({
            //    where: {
            //       username: username
            //    }
            // })

            // if (!admin) {
            //    socket.emit("error", {
            //       error: "Admin doesn't found"
            //    })
            //    return;
            // }
            //
            // console.log(admin)

            // const room: {
            //    error: boolean,
            //    message: string
            //    roomId: string
            // } = this.adminManager.addRoom(roomName, admin.id, socket);
            // this.adminManager.addRoom(roomName, socket);


            // if (room.error) {
            //    socket.emit("error", {
            //       error: room.message
            //    })
            //    return;
            // }
            // console.log("room added")
            // socket.emit("room", {
            //    message: room.message,
            //    roomId: room.roomId
            // })
         });
      })

      socket.on("getMyRooms", ({ }, callback: CallableFunction) => {
         // middleware
         authMiddleware(socket, async (err: any) => {
            console.log("pre middleware")
            if (err) {
               console.log(err);
               return callback({
                  status: 'error',
                  message: "Authentication error"
               })
            }
            const room = await this.adminManager.getRoom(socket);
            return callback(room);
         });
      });

      socket.on("addQuiz", ({ quizId, title, options, answer, countdown }: {
         title: string,
         options: string[],
         answer: number,
         countdown: number,
         quizId: string,
      }) => {
         // const result: {
         //    error: boolean,
         //    message: string
         // } = this.adminManager.addProblem(roomId, quizId, title, options, answer, countdown)

         this.adminManager.addProblem(quizId, title, options, answer, countdown, socket)

         // if (result.error) {
         //    socket.emit("error", {
         //       error: result.message
         //    })
         // } else {
         //    socket.emit("success", {
         //       message: result.message
         //    })
         // }
      })

      // socket.on("getQuiz", ({ roomId }: { roomId: string }) => {
      //    const quiz = this.adminManager.getQuiz(roomId)
      //    console.log("quiz" + JSON.stringify(quiz))
      // })

      socket.on("start", ({ roomId, quizId }: {
         roomId: string,
         quizId: string,
      }) => {
         // join the admin roomId
         // const result: {
         //    error: boolean,
         //    message: string,
         //    countdown: number
         // } = this.adminManager.start(roomId);

         this.adminManager.start(roomId, quizId, socket);

         // if (result.error) {
         //    socket.emit("error", {
         //       error: result.message
         //    })
         // } else {
         //    socket.emit("success", {
         //       message: result.message
         //    })
         //    this.adminManager.getLeaderboard(roomId, result.countdown);
         // }
      })

      socket.on("start-automatically", async ({ roomId, quizId }: {
         roomId: string,
         quizId: string
      }) => {
         const SECONDS_DELAY: number = 10;
         let COUNTDOWN_TIMER: number = 0;

         // const { room, error }: {
         //    room: Room | null,
         //    error: string | null
         // } = this.adminManager.findRoom(roomId);

         // console.log("room" + room)

         // if (!room) {
         //    console.log("error in start-automatically")
         //    socket.emit("error", error);
         //    return;
         // }

         // join the admin roomId
         // socket.join(roomId);
         socket.emit("operation", {
            operation: "start-automatically"
         });

         // const noOfProblems: number = room?.quiz.getQuiz().length;

         const noOfProblems: number = await this.adminManager.getNoOfProblems(roomId, quizId, socket);

         for (let i = 0; i < noOfProblems; i++) {
            if (i === 0) {
               //begin the quiz

               COUNTDOWN_TIMER = await this.adminManager.start(roomId, quizId, socket);
               this.adminManager.getLeaderboard(quizId, roomId, COUNTDOWN_TIMER);
            } else {
               const result: any = this.adminManager.next(roomId, quizId, socket);
               COUNTDOWN_TIMER = result.countdown;
               this.adminManager.getLeaderboard(quizId, roomId, COUNTDOWN_TIMER);
            }
            await new Promise(r => setTimeout(r, (COUNTDOWN_TIMER + SECONDS_DELAY) * 1000));
         }
         //end of the quiz
         this.adminManager.endQuiz(roomId, quizId, socket);
      })

      socket.on("next", ({ roomId, quizId }: {
         roomId: string,
         quizId: string,
      }) => {
         // const result: {
         //    error: boolean,
         //    message: string,
         //    countdown: number
         // } = this.adminManager.next(roomId);
         // if (result.error) {
         //    socket.emit("error", {
         //       error: result.message
         //    })
         // } else {
         //    this.adminManager.getLeaderboard(roomId, result.countdown);
         // }

         this.adminManager.next(roomId, quizId, socket)
      })

      socket.on("end", ({ roomId, quizId }: {
         roomId: string,
         quizId: string
      }) => {
         this.adminManager.endQuiz(roomId, quizId, socket);

         // if (result.error) {
         //    socket.emit("error", {
         //       error: result.message
         //    })
         // }
         // this.adminManager.getLeaderboard(roomId, 0);
      })

      socket.on("disconnect", () => {
         console.log("Admin is disconnected");
      })

      socket.on("RegisterUser", ({ username, password }: {
         username: string,
         password: string,
      }) => {
         this.participantManager.registerUser(username, password, socket);
      })

      socket.on("SigninUser", ({ username, password }: {
         username: string,
         password: string,
      }) => {
         this.participantManager.signinUser(username, password, socket)

         socket.on("JoinRoom", ({ participantId, roomId }: {
            participantId: string,
            roomId: string,
         }) => {
            this.participantManager.joinRoom(roomId, participantId, socket);

            socket.on("Submit", ({ participantId, pointsId, roomId, quizId, problemId, answer }: {
               participantId: string,
               pointsId: string,
               roomId: string,
               quizId: string,
               problemId: string,
               answer: number,
            }) => {
               this.participantManager.submitAnswer(participantId, pointsId, roomId, quizId, problemId, answer, socket);
            })

            socket.on("NoOfProblems", ({ roomId, quizId }: {
               roomId: string,
               quizId: string
            }) => {
               this.adminManager.getNoOfProblems(roomId, quizId, socket);
            })

            socket.on("LeaveRoom", ({ roomId }: {
               roomId: string
            }) => {
               socket.leave(roomId);
            })
         })

         socket.on("disconnect", () => {
            console.log("User disconnected")
         })
      })

      // socket.on("JoinUser", ({ username, roomId }: {
      //    username: string;
      //    roomId: string;
      // }) => {
      //    const resultJoin = this.adminManager.addUser(roomId, username, socket);
      //    if (resultJoin.error) {
      //       socket.emit("resultJoin", {
      //          error: resultJoin.error,
      //          success: false
      //       });
      //    } else {
      //       console.log(resultJoin.problems)
      //       socket.emit("resultJoin", {
      //          id: resultJoin.id,
      //          roomId: resultJoin.roomId,
      //          status: resultJoin.status,
      //          image: resultJoin.image,
      //          problems: resultJoin.problems,
      //          success: true
      //       });
      //       console.log("Succceessfully join")
      //       // socket.join(roomId);
      //       // IoManager.io.to(roomId).emit("problem", resultJoin)
      //    }
      //    socket.on("leaveRoom", ({ roomId }: {
      //       roomId: string
      //    }) => {
      //       console.log("leave room " + roomId)
      //       socket.leave(roomId)
      //    })
      //
      // })


      // socket.on("Submit", ({ userId, roomId, problemId, answer, countdown }:
      //    {
      //       userId: string,
      //       roomId: string,
      //       problemId: string,
      //       answer: number,
      //       countdown: number,
      //    }) => {
      //    this.adminManager.submitAnswer(userId, roomId, problemId, answer, countdown);
      // })

   }
}
