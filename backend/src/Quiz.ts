import { v4 as uuid4 } from 'uuid';
export interface Problem {
   roomId: string;
   id: string;
   title: string;
   options: string[];
   answer: number;
   countdown: number;
}

export interface User {
   id: string;
   username: string;
}

export class Quiz {
   public roomId: string;
   private problems: Problem[];
   public startTime: number;
   private currentProblem: number;

   constructor(roomId: string) {
      this.problems = [];
      this.roomId = roomId;
      this.currentProblem = 0;
      this.startTime = 0;
   }

   addQuiz(roomId: string, title: string, options: string[], answer: number, countdown: number) {
      this.problems.push({
         roomId,
         title,
         id: uuid4(),
         options,
         answer,
         countdown
      });
      console.log("success added problem: " + JSON.stringify(this.problems))
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
         countdown: problem.countdown,
      }
   }

   next() {
      this.currentProblem++;
      if (this.problems.length === this.currentProblem) {
         this.currentProblem--;
         // return this.problems[this.currentProblem];
         return {
            error: true
         }
      }
      const problem = this.problems[this.currentProblem];
      return {
         error: false,
         problem: {
            id: problem.id,
            roomId: problem.roomId,
            title: problem.title,
            options: problem.options,
            countdown: problem.countdown,
         }
      }
   }
}
