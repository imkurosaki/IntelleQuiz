import { Socket } from "socket.io";
import prisma from "../db";
import { IoManager } from "./IoManager";

export const MAX_TIME_SEC = 10;
const MAXPOINTS = 200;

export class ParticipantManager {

   async joinRoom(roomId: string, socket: Socket) {
      const room = await prisma.room.findFirst({
         where: {
            id: roomId,
            userId: {
               not: socket.decoded.id
            }
         },
         select: {
            participants: {
               select: {
                  id: true,
                  username: true
               }
            },
            status: true,
            userId: true
         }
      });

      if (!room) {
         return {
            status: "error",
            message: "Room doesn't found."
         };
      }

      const isUserExist = room?.participants.filter((participant: any) => {
         return participant.id === socket.decoded.id;
      });

      if (isUserExist.length) {
         return {
            status: "error",
            message: "User is already in room"
         };
      }

      if (room?.status !== "WAITING") {
         return {
            status: "error",
            message: `Quiz is ${room?.status}`
         };
      }

      try {
         const updatedRoom = await prisma.room.update({
            where: {
               id: roomId,
            },
            data: {
               participants: {
                  connect: {
                     id: socket.decoded.id
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
               participantId: socket.decoded.id,
               quizId: updatedRoom.quizes[0].id
            }
         });
         // join the room
         socket.join(roomId)

         IoManager.io.to(roomId).emit("participants", {
            participants: updatedRoom.participants
         });

         return {
            status: "success",
            data: {
               roomId,
               pointsId: points.id,
               quizId: updatedRoom.quizes[0].id
            }
         }
      } catch (e: any) {
         return {
            status: "error",
            message: "Sever error, try again later."
         };
      }
   }

   async submitAnswer(pointsId: string, roomId: string, quizId: string, problemId: string, answer: number, socket: Socket) {
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
            room: true
         }
      });

      if (!quiz) {
         socket.emit("error", {
            message: "Quiz is not found."
         })
         return;
      }

      if (quiz.room.userId === socket.decoded.id) {
         socket.emit("error", {
            message: "Admin is not allowed to submit an answer"
         })
         return;
      }

      const problem = quiz?.problems[0];

      if (problem?.answer === answer) {
         const result = await prisma.points.update({
            where: {
               id: pointsId,
               participantId: socket.decoded.id,
               quizId: quizId
            },
            data: {
               points: {
                  increment: this.calculatePoints(problem.startTime?.getTime() || new Date().getTime(), endTime, problem.countdown)
               }
            }
         })
         return;
      }
   }

   async getRecentlyJoinedRooms(socket: Socket) {
      const rooms = await prisma.user.findFirst({
         where: {
            id: socket.decoded.id
         },
         select: {
            joinedRooms: {
               orderBy: {
                  createdAt: 'desc'
               },
               select: {
                  quizes: {
                     select: {
                        id: true,
                        points: {
                           where: {
                              participantId: socket.decoded.id
                           }
                        }
                     }
                  },
                  id: true,
                  name: true,
                  status: true,
                  createdAt: true,
                  user: {
                     select: {
                        username: true,
                     }
                  }
               }
            }
         }
      });
      return rooms;
   }

   private calculatePoints(startTime: number, endTime: number, countdown: number) {
      const durationInMinutes: number = endTime - startTime;
      const durationInSeconds: number = durationInMinutes / 1000;
      const points: number = durationInSeconds > countdown ? 0 :
         MAXPOINTS * (1 - (durationInSeconds / countdown));

      return Math.round(points * 1000) / 1000;
   }
}
