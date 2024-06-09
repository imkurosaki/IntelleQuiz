import { Server, Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
import { IoManager } from "./IoManager";


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
            this.quizManager.start(roomId);
         })

         socket.on("next", ({ roomId }: {
            roomId: string,
         }) => {
            this.quizManager.next(roomId);
         })
      })

      socket.on("JoinUser", ({ username, roomId }: {
         username: string;
         roomId: string;
      }) => {
         const resultJoin = this.quizManager.addUser(roomId, username);
         if (resultJoin) {
            socket.emit("error", resultJoin);
         } else {
            console.log("Succceessfully join")
            socket.join(roomId);
            // IoManager.io.to(roomId).emit("problem", resultJoin)
         }
      })
   }
}
