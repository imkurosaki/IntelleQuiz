"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizManager = void 0;
const Quiz_1 = require("../Quiz");
const uuid_1 = require("uuid");
const IoManager_1 = require("./IoManager");
class QuizManager {
    constructor() {
        this.rooms = [];
    }
    addRoom(roomId, admin) {
        const room = this.rooms.find((room) => room.id === roomId && room.admin === admin);
        if (room) {
            console.log("room is already exist " + roomId);
            return;
        }
        this.rooms.push({
            id: roomId,
            admin,
            quiz: new Quiz_1.Quiz(roomId),
            users: [],
        });
        console.log("successfully added room " + this.rooms);
    }
    addAdmin(username) {
        if (!username) {
            console.log("No username");
            return;
        }
        this.admin = username;
        console.log(this.admin);
    }
    addUser(roomId, username) {
        const room = this.rooms.find((room) => room.id === roomId);
        if (!room) {
            return { error: "Room doesn't exist" };
        }
        const user = room === null || room === void 0 ? void 0 : room.users.find((user) => user.username === username);
        if (user) {
            return { error: "User already in room" };
        }
        room.users.push({
            id: (0, uuid_1.v4)(),
            username: username || ""
        });
        // return room.quiz.getQuiz();
    }
    addQuiz(roomId, title, options, answer) {
        const room = this.rooms.find((room) => room.id === roomId);
        if (!room) {
            console.log("No room found");
            return;
        }
        const quiz = room.quiz;
        quiz.addQuiz(roomId, title, options, answer);
    }
    getQuiz(roomId) {
        const room = this.rooms.find((room) => room.id === roomId);
        if (!room) {
            console.log("No room found");
            return;
        }
        return room.quiz;
    }
    start(roomId) {
        console.log(roomId);
        const room = this.rooms.find((room) => room.id === roomId);
        if (!room) {
            console.log("No room found");
            return;
        }
        const problem = room.quiz.start();
        if (!problem) {
            console.log("You don't have a problem yet.");
            return {
                error: "You don't have a problem yet."
            };
        }
        console.log(problem);
        IoManager_1.IoManager.io.to(roomId).emit("problem", problem);
    }
    next(roomId) {
        const room = this.rooms.find((room) => room.id === roomId);
        if (!room) {
            console.log("No room found");
            return;
        }
        const problem = room.quiz.next();
        if (!problem) {
            console.log("You don't have a problem yet.");
            return {
                error: "You don't have a problem yet."
            };
        }
        IoManager_1.IoManager.io.to(roomId).emit("problem", problem);
    }
}
exports.QuizManager = QuizManager;
