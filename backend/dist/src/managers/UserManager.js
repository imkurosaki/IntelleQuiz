"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const QuizManager_1 = require("./QuizManager");
class UserManager {
    constructor() {
        this.quizManager = new QuizManager_1.QuizManager;
    }
    addUser(socket) {
        console.log("connected");
        socket.on("Admin", ({ username }) => {
            this.quizManager.addAdmin(username);
            socket.on("addRoom", ({ roomId }) => {
                const username = this.quizManager.admin;
                if (!username) {
                    return;
                }
                this.quizManager.addRoom(roomId, username);
            });
            socket.on("addQuiz", ({ roomId, title, options, answer }) => {
                this.quizManager.addQuiz(roomId, title, options, answer);
            });
            socket.on("getQuiz", ({ roomId }) => {
                const quiz = this.quizManager.getQuiz(roomId);
                console.log("quiz" + JSON.stringify(quiz));
            });
            socket.on("start", ({ roomId }) => {
                this.quizManager.start(roomId);
            });
            socket.on("next", ({ roomId }) => {
                this.quizManager.next(roomId);
            });
        });
        socket.on("JoinUser", ({ username, roomId }) => {
            const resultJoin = this.quizManager.addUser(roomId, username);
            if (resultJoin) {
                socket.emit("error", resultJoin);
            }
            else {
                console.log("Succceessfully join");
                socket.join(roomId);
                // IoManager.io.to(roomId).emit("problem", resultJoin)
            }
        });
    }
}
exports.UserManager = UserManager;
