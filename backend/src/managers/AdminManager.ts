import { Socket } from "socket.io";
import { Problem, Quiz } from "../Quiz";
import { v4 as uuidv4 } from 'uuid';
import { IoManager } from "./IoManager";
import { generateRandomString } from "../lib/randomStrings";
import prisma from "../db";
import { generateToken } from "../lib/generateToken";
import { Leaderboard } from "../lib/types/types";
import bcrypt from "bcrypt";

export enum Status {
   Waiting = "waiting",
   Started = "started",
   Ongoing = "ongoing",
   Finished = "finished",
}

export interface Room {
   id: string;
   name: string;
   admin: string;
   status: Status;
   quiz: Quiz;
   users: User[];
}

export interface User {
   id: string;
   username: string;
   points: number;
   image: string;
}

// timer 10 seconds to answer the problems
export const MAX_TIME_SEC = 10;
const MAXPOINTS = 200;

export class AdminManager {
   // public admin?: string;
   private rooms: Room[];

   constructor() {
      this.rooms = [];
   }

   findRoom(roomId: string) {
      const room = this.rooms.find((room: any) => room.id === roomId);
      if (!room) {
         return {
            room: null,
            error: "Room doesn't exist"
         };
      }
      return {
         room,
         error: null
      };
   }

   async addRoom(roomName: string, socket: Socket) {
      const room = await prisma.room.findFirst({
         where: {
            name: roomName,
            adminId: socket.decoded.id
         }
      });
      // const room = this.rooms.find((room: Room) => room.name === roomName && room.admin === admin);
      if (room) {
         console.log("room is already exist " + roomName);
         // return {
         //    error: true,
         //    message: `${roomName} Room is already exist`,
         //    roomId: ""
         // };
         socket.emit("error", {
            message: `${roomName} Room is already exist`
         })
         return;
      }

      try {
         const roomId: string = generateRandomString(15)
         await prisma.room.create({
            data: {
               id: roomId,
               name: roomName,
               adminId: socket.decoded.id,
            }
         });
         await prisma.quiz.create({
            data: {
               roomId: roomId
            }
         })
         socket.emit("room", {
            message: "Room is successfully added",
         })

         const rooms = await prisma.room.findMany({
            where: {
               adminId: socket.decoded.id
            },
            orderBy: {
               createdAt: 'desc'
            },
            select: {
               id: true,
               name: true,
               status: true,
               createdAt: true,
               quizes: true
            }
         });
         socket.emit("getMyRooms", rooms);
      } catch (e: any) {
         socket.emit("error", {
            error: `${roomName} Room is already exist`
         })
      }

      // this.rooms.push({
      //    id: roomId,
      //    name: roomName,
      //    admin,
      //    status: Status.Waiting,
      //    quiz: new Quiz(roomId),
      //    users: [],
      // })
      // console.log("successfully added room " + this.rooms)
      // return {
      //    error: false,
      //    message: "Room is successfully added",
      //    roomId
      // };
   }

   async deleteRoom(socket: Socket, roomId: string) {
      try {
         const result = await prisma.room.delete({
            where: {
               id: roomId
            }
         });

         const rooms = await prisma.room.findMany({
            where: {
               adminId: socket.decoded.id
            }
         })
         socket.emit("getMyRooms", rooms);
         return {
            status: "success",
            message: `Room ${result.name} is successfully deleted.`
         }
      } catch (e: any) {
         return {
            status: "error",
            message: `Room is not found.`
         }
      }
   }

   async getRoom(socket: Socket, roomId: string) {
      try {
         const room = await prisma.room.findUnique({
            where: {
               id: roomId,
               adminId: socket.decoded.id
            },
            select: {
               quizes: true,
               status: true,
            }
         });
         if (room?.status === "FINISHED") {
            const quizId = room.quizes[0].id;
            this.getLeaderboard(quizId, roomId, 0);
         }
         return room;
      } catch (e: any) {
         return {
            status: 'error',
            message: "Room doesn't exist"
         }
      }
   }

   async getRooms(socket: Socket) {
      const rooms = await prisma.room.findMany({
         where: {
            adminId: socket.decoded.id
         },
         orderBy: {
            createdAt: 'desc'
         },
         select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
            quizes: true
         }
      });
      return rooms;
   }

   async registerAdmin(username: string, password: string) {
      try {
         const salt = bcrypt.genSaltSync(10);
         const hashPassword = bcrypt.hashSync(password, salt);
         const result = await prisma.admin.create({
            data: {
               username: username,
               password: hashPassword,
               image: Math.floor(Math.random() * 7) + 1
            }
         });
         console.log(result)
         return {
            status: 'success',
            message: "Username are successfully register"
         }
      } catch (e: any) {
         return {
            status: 'error',
            message: "Email / Username is already taken"
         }
      }
   }

   async signinAdmin(username: string, password: string, socket: Socket) {
      try {
         const admin = await prisma.admin.findFirst({
            where: {
               username: username,
            }
         });

         if (!admin) {
            socket.emit("error", {
               error: "Username is not found"
            });
            return;
         } else if (!bcrypt.compareSync(password, admin.password)) {
            socket.emit("error", {
               error: "Password is not match"
            });
            return;
         } else {
            socket.emit("signed", {
               message: "You've successfully login",
               data: {
                  id: admin.id,
                  username: admin.username,
                  image: admin.image
               },
               token: `Bearer ${generateToken({ adminId: admin.id, username: admin.username })}`
            })
         }
      } catch (e: any) {
         socket.emit("server-error", {
            error: "Something error happened, try again later."
         })
      }
   }

   addUser(roomId: string, username: string, socket: Socket) {
      const room = this.rooms.find((room: Room) => room.id === roomId);
      console.log(room?.status)
      if (!room) {
         return { error: "Room doesn't exist" };
      }
      const user = room?.users.find((user: any) => user.username === username);
      if (user) {
         return { error: "User already in room" };
      }

      if (room.status === Status.Finished || room.status === Status.Ongoing || room.status === Status.Started) {
         return { error: `Quiz is ${room?.status}` }
      }

      // temporarily added this for avatar
      const randomNumber = Math.floor(Math.random() * 7) + 1;
      const id: string = uuidv4()
      room.users.push({
         id,
         username: username || "",
         points: 0,
         image: randomNumber.toString(),
      })
      socket.join(roomId);
      IoManager.io.to(roomId).emit("participants", {
         participants: room.users
      });
      return {
         id,
         roomId: room.id,
         image: randomNumber,
         status: room.status,
         problems: room.quiz.getQuiz()
      };
   }

   // async addQuiz(roomId: string, quizId: string, title: string, options: string[], answer: number, countdown: number, socket: Socket) {
   //    const room = prisma.room.findFirst({
   //       where: {
   //          id: roomId
   //       }
   //    })
   //    // const room = this.rooms.find((room: Room) => room.id === roomId)
   //    if (!room) {
   //       console.log("No room found")
   //       // return {
   //       //    error: true,
   //       //    message: "No room found"
   //       // };
   //       socket.emit("error", {
   //          error: `${roomId} Room is already exist`
   //       })
   //       return;
   //    }
   //
   //    // const quiz = room.quizes;
   //    try {
   //       const newProblem = await prisma.problem.create({
   //          data: {
   //             title: title,
   //          }
   //       })
   //       const options = await prisma.option.create({
   //          data: {
   //             choice: optio
   //          }
   //       })
   //
   //    } catch (e: any) {
   //       socket.emit("error", {
   //          error: ""
   //       })
   //    }
   //    // quiz.addQuiz(roomId, title, options, answer, countdown);
   //    // return {
   //    //    error: false,
   //    //    message: "Problem added successfully"
   //    // }
   // }

   async addProblem(quizId: string, title: string, options: string[], answer: number, countdown: number, socket: Socket) {
      try {
         const problem = await prisma.problem.create({
            data: {
               title: title,
               answer: answer,
               countdown: countdown,
               quizId: quizId
            }
         });

         const optionPromises = options.map((option: string) => {
            return prisma.option.create({
               data: {
                  choice: option,
                  problemId: problem.id
               }
            })
         });

         await Promise.all(optionPromises);

         socket.emit("success", {
            message: "Successfully added the problem"
         })

         socket.emit("adminAddProblem", {
            addedProblem: 1
         })
      } catch (e: any) {
         socket.emit("error", {
            message: "Failed to add problem"
         })
      }
   }

   getQuiz(roomId: string) {
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }
      return room.quiz;
   }

   submitAnswer(userId: string, roomId: string, problemId: string, answer: number, countdown: number) {
      const endTime = new Date().getTime();
      const room = this.rooms.find((room: Room) => room.id === roomId)
      if (!room) {
         console.log("No room found")
         return;
      }
      const problem = room.quiz.getQuiz().find((problem: Problem) => problem.id === problemId);
      if (problem?.answer === answer) {
         const user = room.users.find((user: User) => user.id === userId);
         if (!user) {
            console.log("User is not found");
            return;
         }
         user.points += this.calculatePoints(room.quiz.startTime, endTime, countdown);
      }
   }

   calculatePoints(startTime: number, endTime: number, countdown: number) {
      const durationInMinutes = endTime - startTime;
      const durationInSeconds = durationInMinutes / 1000;
      const points = durationInSeconds > countdown ? 0 :
         MAXPOINTS * (1 - (durationInSeconds / countdown));

      return Math.round(points * 1000) / 1000;
   }

   async start(roomId: string, quizId: string, socket: Socket): Promise<number> {
      const room = await prisma.room.findFirst({
         where: {
            id: roomId
         },
         select: {
            quizes: {
               where: {
                  id: quizId,
                  roomId: roomId
               },
               select: {
                  problems: {
                     orderBy: {
                        createdAt: 'asc'
                     },
                     select: {
                        id: true,
                        title: true,
                        options: true,
                        answer: true,
                        countdown: true,
                        quizId: true
                     }
                  },
                  currentProblem: true,
                  roomId: true
               }
            },
            status: true,
         }
      })

      if (!room?.quizes) {
         socket.emit("error", {
            message: `Quiz id ${quizId} doesn't found`
         })
         return 0;
      }

      //select the first problem 
      const problem = room?.quizes[0].problems[0];
      if (!problem) {
         socket.emit("error", {
            message: `You don't have a problem yet`
         })
         return 0;
      }

      if (room.status === "ONGOING" || room.status === "STARTED") {
         socket.emit("error", {
            message: `You can't restart the quiz`
         })
         return 0;
      }

      try {
         await prisma.$transaction(async (prisma) => {
            const quiz = await prisma.quiz.update({
               where: {
                  id: quizId,
                  roomId: roomId
               },
               data: {
                  currentProblem: room.quizes[0].currentProblem + 1
               },
               select: {
                  problems: true,
                  roomId: true
               }
            });

            await prisma.problem.update({
               where: {
                  id: problem.id,
               },
               data: {
                  startTime: new Date()
               }
            });

            const updateRoom = await prisma.room.update({
               where: {
                  id: roomId
               },
               data: {
                  status: "STARTED"
               }
            })
            // join the admin roomId
            socket.join(roomId);

            IoManager.io.to(roomId).emit("participantProblem", {
               problem,
               index: 0,
               roomId: quiz.roomId,
               currentProblem: 1,
               noOfProblems: quiz.problems.length,
               status: updateRoom.status
            });

            IoManager.io.to(roomId).emit("adminProblem", {
               problem,
               index: 0,
               currentProblem: 1,
               roomId: quiz.roomId,
               noOfProblems: quiz.problems.length,
               status: room.status
            })
            this.getLeaderboard(quizId, roomId, problem.countdown);
         });
         console.log("start " + problem.countdown)
         return problem.countdown
      } catch (e: any) {
         console.log(e)
         socket.emit("error", {
            message: "Error fetching quiz, try again later"
         })
         return 0;
      }
   }

   async next(roomId: string, quizId: string, socket: Socket) {
      const room = await prisma.room.findFirst({
         where: {
            id: roomId
         },
         select: {
            quizes: {
               where: {
                  id: quizId,
                  roomId: roomId
               },
               select: {
                  problems: {
                     orderBy: {
                        createdAt: 'asc'
                     },
                     select: {
                        id: true,
                        title: true,
                        options: true,
                        answer: true,
                        countdown: true,
                        quizId: true,
                        createdAt: true
                     }
                  },
                  currentProblem: true,
                  roomId: true
               }
            },
            status: true,
            participants: true
         }
      });

      console.log(room?.participants)

      if (!room?.quizes) {
         socket.emit("error", {
            message: `Quiz id ${quizId} doesn't found`
         })
         return 0;
      }

      const noOfProblems: number = room.quizes[0].problems.length;
      const quiz = room.quizes[0];
      if (noOfProblems === quiz.currentProblem) {
         socket.emit("error", {
            message: `There's no problems left.`
         })
         return 0;
      }

      if (room.status === "WAITING") {
         socket.emit("error", {
            message: `Quiz is not started yet`
         })
         return 0;
      }

      const problem = room.quizes[0].problems[quiz.currentProblem];
      try {
         await prisma.$transaction(async (prisma) => {
            // Update Quiz
            const newQuiz = await prisma.quiz.update({
               where: {
                  id: quizId,
                  roomId: roomId
               },
               data: {
                  currentProblem: room.quizes[0].currentProblem + 1
               }
            });

            // Update Problem
            await prisma.problem.update({
               where: {
                  id: problem.id,
               },
               data: {
                  startTime: new Date()
               }
            });

            // Update Room
            await prisma.room.update({
               where: {
                  id: roomId
               },
               data: {
                  status: "ONGOING"
               }
            })

            IoManager.io.to(roomId).emit("participantProblem", {
               problem,
               index: 0,
               roomId: quiz.roomId,
               currentProblem: newQuiz.currentProblem,
               noOfProblems: quiz.problems.length,
               status: room.status
            });

            IoManager.io.to(roomId).emit("adminProblem", {
               problem,
               index: 0,
               roomId: quiz.roomId,
               currentProblem: newQuiz.currentProblem,
               noOfProblems: quiz.problems.length,
               status: room.status
            })
            this.getLeaderboard(quizId, roomId, problem.countdown);
         });

         console.log("next " + problem.countdown)
         return problem.countdown
      } catch (e: any) {
         console.log(e)
         socket.emit("error", {
            message: "Error fetching quiz, try again later"
         })
         return 0;
      }

      // const room = this.rooms.find((room: Room) => room.id === roomId)
      // if (!room) {
      //    console.log("No room found")
      //    return {
      //       error: true,
      //       message: "No room found",
      //       countdown: 0
      //    };
      // }
      //
      // const { error, problem, index }: any = room.quiz.next();
      // if (error) {
      //    return {
      //       error: true,
      //       message: "There's no problems left.",
      //       countdown: 0
      //    }
      // }
      // room.status = Status.Ongoing;
      // room.quiz.startTime = new Date().getTime();
      // IoManager.io.to(roomId).emit("problem", {
      //    problem: {
      //       id: problem.id,
      //       roomId: problem.roomId,
      //       title: problem.title,
      //       options: problem.options,
      //       countdown: problem.countdown,
      //    },
      //    status: room.status
      // });
      // IoManager.io.to(roomId).emit("adminProblem", {
      //    problem,
      //    index,
      //    status: room.status
      // })
      // return {
      //    error: false,
      //    message: "",
      //    countdown: problem.countdown
      // };g
   }

   async endQuiz(roomId: string, quizId: string, socket: Socket) {
      const leaderboard: Leaderboard[] = await prisma.points.findMany({
         where: {
            quizId: quizId
         },
         orderBy: {
            points: 'desc'
         },
         select: {
            points: true,
            participant: {
               select: {
                  id: true,
                  username: true,
                  image: true
               }
            }
         }
      })

      console.log(leaderboard)
      try {
         await prisma.$transaction(async (prisma) => {
            await prisma.room.update({
               where: {
                  id: roomId
               },
               data: {
                  status: "FINISHED",
               }
            });

            await prisma.quiz.update({
               where: {
                  id: quizId,
                  roomId: roomId
               },
               data: {
                  currentProblem: 0
               }
            });

            IoManager.io.to(roomId).emit("end", {
               status: "FINISHED",
               leaderboard: leaderboard
            });
         });
      } catch (e: any) {
         socket.emit("error", {
            message: "Server failure, try agin later."
         })
      }

      // const room = this.rooms.find((room: Room) => room.id === roomId) if (!room) { console.log("No room found") return { error: true, message: "No room found" }; }
      //
      // room.status = Status.Finished;
      // IoManager.io.to(roomId).emit("end", {
      //    status: room.status,
      //    leaderboard: this.leaderboard(room),
      // });
      // return {
      //    error: false,
      //    message: "Room is end"
      // }
   }

   getLeaderboard(quizId: string, roomId: string, countdown: number) {
      console.log("leaderboard " + countdown)
      // const room = this.rooms.find((room: Room) => room.id === roomId)
      // if (!room) {
      //    console.log("No room found")
      //    return;
      // }

      setTimeout(async () => {
         const leaderboard: Leaderboard[] = await prisma.points.findMany({
            where: {
               quizId: quizId
            },
            orderBy: {
               points: 'desc'
            },
            select: {
               points: true,
               participant: {
                  select: {
                     id: true,
                     username: true,
                     image: true
                  }
               }
            }
         })
         // const leaderboard = room.users.sort((a, b) => a.points - b.points).reverse();
         IoManager.io.to(roomId).emit("leaderboard", {
            leaderboard: leaderboard,
            status: "LEADERBOARD",
         });
      }, countdown * 1000)
   }

   async getNoOfProblems(roomId: string, quizId: string, socket: Socket) {
      try {
         const room = await prisma.room.findUnique({
            where: {
               id: roomId
            },
            select: {
               quizes: {
                  where: {
                     id: quizId
                  },
                  select: {
                     problems: true
                  }
               }
            }
         });
         if (!room?.quizes.length) {
            socket.emit("error", {
               message: `Quiz is not found`
            })
            return 0;
         }

         const problemsLength = room?.quizes[0].problems.length;
         socket.emit("noOfProblems", {
            problemsLength
         });
         console.log(problemsLength)
         return problemsLength;
      } catch (e: any) {
         socket.emit("error", {
            message: `Server error try again later`
         });
         return 0;
      }
   }
   //
   // private leaderboard(room: Room) {
   //    return room.users.sort((a, b) => a.points - b.points).reverse();
   // }
}
