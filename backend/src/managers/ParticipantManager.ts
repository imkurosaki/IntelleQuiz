import { Socket } from "socket.io";
import prisma from "../db";
import { IoManager } from "./IoManager";
import { generateToken } from "../lib/generateToken";

export const MAX_TIME_SEC = 10;
const MAXPOINTS = 200;

export class ParticipantManager {

   async registerUser(username: string, password: string, socket: Socket) {
      try {
         const result = await prisma.participant.create({
            data: {
               username: username,
               password: password,
               image: Math.floor(Math.random() * 7) + 1
            }
         });
         console.log(result)
         socket.emit("success", {
            message: "You've successfully register"
         })
      } catch (e: any) {
         socket.emit("error", {
            error: "Username is already taken."
         })
      }
   }

   async signinUser(username: string, password: string, socket: Socket) {
      try {
         const user = await prisma.participant.findFirst({
            where: {
               username: username,
               password: password
            }
         });

         if (!user) {
            socket.emit("error", {
               error: "Username is doesn't found."
            })
            return;
         }

         socket.emit("signed", {
            message: "You've successfully login",
            user: {
               id: user.id,
               username: user.username,
               image: user.image
            },
            token: `Bearer ${generateToken({ userId: user.id, username: user.username })}`
         })
      } catch (e: any) {
         socket.emit("error", {
            error: "Sever error, try again later."
         })
      }
   }

   async joinRoom(roomId: string, participantId: string, socket: Socket) {
      const room = await prisma.room.findFirst({
         where: {
            id: roomId
         },
         select: {
            participants: {
               select: {
                  id: true,
                  username: true
               }
            },
            status: true
         }
      });

      if (!room) {
         socket.emit("error", {
            error: "Room doesn't found."
         })
         return;
      }

      const isUserExist = room?.participants.filter((participant: any) => {
         return participant.id === participantId;
      });

      if (isUserExist.length) {
         socket.emit("error", {
            error: "User is already in room"
         })
         return;
      }

      if (room?.status !== "WAITING") {
         socket.emit("error", {
            error: `Quiz is ${room?.status}`
         });
         return;
      }

      try {
         const updatedRoom = await prisma.room.update({
            where: {
               id: roomId
            },
            data: {
               participants: {
                  connect: {
                     id: participantId
                  }
               }
            },
            select: {
               quizes: true,
               participants: true
            }
         });

         const points = await prisma.points.create({
            data: {
               participantId: participantId,
               quizId: updatedRoom.quizes[0].id
            }
         });
         // join the room
         socket.join(roomId)

         IoManager.io.to(roomId).emit("participants", {
            participants: updatedRoom.participants
         });

         socket.emit("joined", {
            roomId,
            status: room.status,
            pointsId: points.id
         });
      } catch (e: any) {
         socket.emit("error", {
            error: "Sever error, try again later."
         })
      }
   }

   async submitAnswer(participantId: string, pointsId: string, roomId: string, quizId: string, problemId: string, answer: number, socket: Socket) {
      const endTime: number = new Date().getTime();

      const quiz = await prisma.quiz.findUnique({
         where: {
            id: quizId,
            roomId: roomId
         },
         select: {
            id: true,
            currentProblem: true,
            problems: {
               where: {
                  id: problemId
               },
               select: {
                  id: true,
                  answer: true,
                  title: true,
                  countdown: true,
                  startTime: true
               }
            },
         }
      });

      if (!quiz) {
         socket.emit("error", {
            error: "Quiz is not found."
         })
         return;
      }

      const problem = quiz?.problems[0];
      console.log("problem Id: " + problemId);
      console.log(quiz.problems);
      console.log(problem.startTime?.getTime())

      if (problem?.answer === answer) {
         console.log("correct answer")

         const result = await prisma.points.update({
            where: {
               id: pointsId,
               participantId: participantId,
               quizId: quizId
            },
            data: {
               points: {
                  increment: this.calculatePoints(problem.startTime?.getTime() || new Date().getTime(), endTime, problem.countdown)
               }
            }
         })
         console.log(result)
         return;
      }
      console.log("wrong answer")
   }

   private calculatePoints(startTime: number, endTime: number, countdown: number) {
      const durationInMinutes: number = endTime - startTime;
      const durationInSeconds: number = durationInMinutes / 1000;
      const points: number = durationInSeconds > countdown ? 0 :
         MAXPOINTS * (1 - (durationInSeconds / countdown));

      return Math.round(points * 1000) / 1000;
   }
}
