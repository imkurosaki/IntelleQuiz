"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const uuid_1 = require("uuid");
class Quiz {
    constructor(roomId) {
        this.problems = [];
        this.roomId = roomId;
        this.currentProblem = 0;
    }
    addQuiz(roomId, title, options, answer) {
        this.problems.push({
            roomId,
            title,
            id: (0, uuid_1.v4)(),
            options,
            answer,
        });
        console.log("success added problem: " + JSON.stringify(this.problems));
    }
    getQuiz() {
        return this.problems;
    }
    start() {
        const problem = this.problems[this.currentProblem];
        return {
            id: problem.id,
            roomId: problem.roomId,
            title: problem.title,
            options: problem.options,
        };
    }
    next() {
        this.currentProblem++;
        if (this.problems.length === this.currentProblem) {
            this.currentProblem--;
            return this.problems[this.currentProblem];
        }
        const problem = this.problems[this.currentProblem];
        return {
            id: problem.id,
            roomId: problem.roomId,
            title: problem.title,
            options: problem.options,
        };
    }
}
exports.Quiz = Quiz;
