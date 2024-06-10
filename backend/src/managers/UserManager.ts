import { Server, Socket } from "socket.io";
import { MAX_TIME_SEC, QuizManager, Room, Status } from "./QuizManager";
import { IoManager } from "./IoManager";
import { Quiz } from "../Quiz";

export class UserManager {
   private quizManager;

   constructor() {
      this.quizManager = new QuizManager;
   }

   addUser(socket: Socket) {
      console.log("connected")
      socket.on("Admin", ({ username }: { username: string }) => {
         this.quizManager.addAdmin(username)

         socket.on("addRoom", ({ roomId }: { roomId: string }) => {
            const username = this.quizManager.admin;
            if (!username) {
               return
            }
            this.quizManager.addRoom(roomId, username);
         })

         socket.on("addQuiz", ({ roomId, title, options, answer }: {
            roomId: string,
            title: string,
            options: string[],
            answer: number,
         }) => {
            this.quizManager.addQuiz(roomId, title, options, answer)
         })

         socket.on("getQuiz", ({ roomId }: { roomId: string }) => {
            const quiz = this.quizManager.getQuiz(roomId)
            console.log("quiz" + JSON.stringify(quiz))
         })

         socket.on("start", ({ roomId }: {
            roomId: string,
         }) => {
            console.log("start quiz")
            const result = this.quizManager.start(roomId);
            if (!result) {
               this.quizManager.getLeaderboard(roomId);
            }
         })

         socket.on("start-automatically", async ({ roomId }: {
            roomId: string,
         }) => {
            const SECONDS_DELAY = 10;
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
                  this.quizManager.start(roomId);
                  this.quizManager.getLeaderboard(roomId);
               } else {
                  this.quizManager.next(roomId);
                  this.quizManager.getLeaderboard(roomId);
               }
               await new Promise(r => setTimeout(r, (MAX_TIME_SEC + SECONDS_DELAY) * 1000));
            }
            //end of the quiz
            this.quizManager.endQuiz(roomId);
            this.quizManager.getLeaderboard(roomId);
         })

         socket.on("next", ({ roomId }: {
            roomId: string,
         }) => {
            this.quizManager.next(roomId);
            this.quizManager.getLeaderboard(roomId);
         })

         socket.on("end", ({ roomId }: {
            roomId: string,
         }) => {
            this.quizManager.endQuiz(roomId);
            this.quizManager.getLeaderboard(roomId);
         })
      })

      socket.on("JoinUser", ({ username, roomId }: {
         username: string;
         roomId: string;
      }) => {
         const resultJoin = this.quizManager.addUser(roomId, username);
         if (resultJoin.error) {
            socket.emit("resultJoin", {
               error: resultJoin.error,
               success: false
            });
         } else {
            socket.emit("resultJoin", {
               id: resultJoin.id,
               status: resultJoin.status,
               success: true
            });
            console.log("Succceessfully join")
            socket.join(roomId);
            // IoManager.io.to(roomId).emit("problem", resultJoin)
         }
      })

      socket.on("Submit", ({ userId, roomId, problemId, answer }:
         {
            userId: string,
            roomId: string,
            problemId: string,
            answer: number,
         }) => {
         this.quizManager.submitAnswer(userId, roomId, problemId, answer);
      })
   }
}
