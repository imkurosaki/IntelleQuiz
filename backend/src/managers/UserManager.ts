import { Server, Socket } from "socket.io";
import { MAX_TIME_SEC, QuizManager, Room, Status } from "./QuizManager";
import { IoManager } from "./IoManager";
import { Problem, Quiz } from "../Quiz";

export class UserManager {
   private quizManager;

   constructor() {
      this.quizManager = new QuizManager;
   }

   addUser(socket: Socket) {
      console.log("connected")
      socket.on("Admin", ({ username }: { username: string }) => {
         if (!username) {
            socket.emit("error", {
               error: "Please enter username"
            })
            return;
         }
         this.quizManager.addAdmin(username)

         socket.on("addRoom", ({ roomName }: { roomName: string }) => {
            const username = this.quizManager.admin;
            if (!username) {
               return
            }
            const room: {
               error: boolean,
               message: string
               roomId: string
            } = this.quizManager.addRoom(roomName, username);

            if (room.error) {
               socket.emit("error", {
                  error: room.error
               })
               return;
            }
            console.log("room added")
            socket.emit("room", {
               message: room.message,
               roomId: room.roomId
            })
         })

         socket.on("addQuiz", ({ roomId, title, options, answer, countdown }: {
            roomId: string,
            title: string,
            options: string[],
            answer: number,
            countdown: number,
         }) => {
            const result: {
               error: boolean,
               message: string
            } = this.quizManager.addQuiz(roomId, title, options, answer, countdown)
            if (result.error) {
               socket.emit("error", {
                  error: result.message
               })
            } else {
               socket.emit("success", {
                  error: result.message
               })
            }
         })

         socket.on("getQuiz", ({ roomId }: { roomId: string }) => {
            const quiz = this.quizManager.getQuiz(roomId)
            console.log("quiz" + JSON.stringify(quiz))
         })

         socket.on("start", ({ roomId }: {
            roomId: string,
         }) => {
            console.log("start quiz")
            const result: {
               error: boolean,
               message: string,
               countdown: number
            } = this.quizManager.start(roomId);

            if (result.error) {
               socket.emit("error", {
                  error: result.message
               })
            } else {
               socket.emit("success", {
                  message: result.message
               })
               this.quizManager.getLeaderboard(roomId, result.countdown);
            }
         })

         socket.on("start-automatically", async ({ roomId }: {
            roomId: string,
         }) => {
            const SECONDS_DELAY = 10;
            let COUNTDOWN_TIMER = 0;
            const { room, error }: {
               room: Room | null,
               error: string | null
            } = this.quizManager.findRoom(roomId);

            console.log("room" + room)

            if (!room) {
               console.log("error in start-automatically")
               socket.emit("error", error);
               return;
            }
            const noOfProblems: number = room?.quiz.getQuiz().length;
            for (let i = 0; i < noOfProblems; i++) {
               if (i === 0) {
                  //begin the quiz
                  const result: any = this.quizManager.start(roomId);
                  COUNTDOWN_TIMER = result.countdown;
                  this.quizManager.getLeaderboard(roomId, result.countdown);
               } else {
                  const result: any = this.quizManager.next(roomId);
                  COUNTDOWN_TIMER = result.countdown;
                  this.quizManager.getLeaderboard(roomId, result.countdown);
               }
               await new Promise(r => setTimeout(r, (COUNTDOWN_TIMER + SECONDS_DELAY) * 1000));
            }
            //end of the quiz
            this.quizManager.endQuiz(roomId);
         })

         socket.on("next", ({ roomId }: {
            roomId: string,
         }) => {
            const result: {
               error: boolean,
               message: string,
               countdown: number
            } = this.quizManager.next(roomId);
            if (result.error) {
               socket.emit("error", {
                  error: result.message
               })
            } else {
               this.quizManager.getLeaderboard(roomId, result.countdown);
            }
         })

         socket.on("end", ({ roomId }: {
            roomId: string,
         }) => {
            const result: {
               error: boolean,
               message: string
            } = this.quizManager.endQuiz(roomId);

            if (result.error) {
               socket.emit("error", {
                  error: result.message
               })
            }
            // this.quizManager.getLeaderboard(roomId, 0);
         })

         socket.on("disconnect", () => {
            console.log("Admin is disconnected");
         })
      })

      socket.on("JoinUser", ({ username, roomId }: {
         username: string;
         roomId: string;
      }) => {
         const resultJoin = this.quizManager.addUser(roomId, username, socket);
         if (resultJoin.error) {
            socket.emit("resultJoin", {
               error: resultJoin.error,
               success: false
            });
         } else {
            console.log(resultJoin.problems)
            socket.emit("resultJoin", {
               id: resultJoin.id,
               roomId: resultJoin.roomId,
               status: resultJoin.status,
               problems: resultJoin.problems,
               success: true
            });
            console.log("Succceessfully join")
            // socket.join(roomId);
            // IoManager.io.to(roomId).emit("problem", resultJoin)
         }
         socket.on("leaveRoom", ({ roomId }: {
            roomId: string
         }) => {
            console.log("leave room " + roomId)
            socket.leave(roomId)
         })

      })


      socket.on("Submit", ({ userId, roomId, problemId, answer, countdown }:
         {
            userId: string,
            roomId: string,
            problemId: string,
            answer: number,
            countdown: number,
         }) => {
         this.quizManager.submitAnswer(userId, roomId, problemId, answer, countdown);
      })

      socket.on("disconnect", () => {
         console.log("User disconnected")
      })
   }
}
