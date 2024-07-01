import { useEffect, useState } from "react"
import { useSocket } from "../../lib/hooks"
import { Socket } from "socket.io-client";
import { CountdownCircle } from "../../components/CountdownCircle";
import Button from "../../components/Button";
import { Participant } from "../../components/Room/WaitingPage";
import Leaderboard from "../../components/Room/Leaderboard";
import { useRecoilState } from "recoil";
import { AdminInfo, adminInfo } from "../../store/admin.ts";
import { useNavigate } from "react-router-dom";
import EndRoom from "../../components/Room/EndRoom";
import Cookies from 'js-cookie';
import { ErrorIcons } from "./Register.tsx";
import { toast } from "sonner";
import { CopyClipboard } from "../../components/Accordion.tsx";
import OptionEnd from "./OptionEnd.tsx";

export type AdminProblem = {
   title: string;
   id: string;
   options: Option[];
   answer: number;
   countdown: number;
   quizId: string;
}

export type Option = {
   id: string;
   choice: string;
   problemId: string;
}

export default function Started() {
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");
   const [problem, setProblem] = useState<AdminProblem>({
      id: "",
      title: "",
      options: [],
      answer: 0,
      countdown: 0,
      quizId: "",
   })
   const [operation, setOperation] = useState<string>("manually");
   const [status, setStatus] = useState("")
   const [leaderboard, setLeaderBoards] = useState<Participant[]>([])
   const [adminInfoAtom] = useRecoilState<AdminInfo>(adminInfo);
   const navigate = useNavigate();
   const [roomId, setRoomId] = useState("");
   const [noOfProblems, setNoOfProblems] = useState(0);
   const [currentProblem, setCurrentProblem] = useState(0);

   useEffect(() => {
      if (!Cookies.get('token')) {
         navigate('/signin')
      }

      socket.on("adminProblem", ({ problem, currentProblem, roomId, status, noOfProblems, index }: {
         problem: AdminProblem,
         roomId: string,
         status: string,
         noOfProblems: number,
         currentProblem: number,
         index: number
      }) => {
         setNoOfProblems(noOfProblems);
         setCurrentProblem(currentProblem);
         setRoomId(roomId);
         setProblem(problem)
         setStatus(status);
      })

      socket.on("operation", ({ operation }: {
         operation: string
      }) => {
         setOperation(operation);
      });

      socket.on("leaderboard", ({ leaderboard, status }: {
         leaderboard: Participant[],
         status: string
      }) => {
         setStatus(status);
         setLeaderBoards(leaderboard);
      })

      socket.on("end", ({ status, leaderboard }: {
         status: string,
         leaderboard: Participant[],
      }) => {
         setStatus(status);
         setLeaderBoards(leaderboard);
      })

      socket.on("error", ({ message }: { message: string }) => {
         toast(message, {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
      });

      return () => {
         socket.off("adminProblem");
         socket.off("operation");
         socket.off("leaderboard");
         socket.off("error");
      }
   }, [socket, adminInfoAtom, navigate])


   if (status === "LEADERBOARD") {
      return <div className="flex flex-col items-center pt-24">
         <Leaderboard leaderboard={leaderboard} />
         <div className="mt-12 text-center">
            <p className="text-sm mb-5 text-gray-500">{currentProblem} of {noOfProblems} problems</p>
            <div className="flex gap-2">
               <Button
                  onClick={() => {
                     socket.emit("next", {
                        roomId,
                        quizId: problem.quizId
                     })
                  }}
                  className="py-2 px-3 text-white rounded-lg border-2 border-gray-200"
                  disabled={operation === "start-automatically" ? true : false}
               >
                  Next Problem
               </Button>
               <Button
                  onClick={() => {
                     socket.emit("end", {
                        roomId,
                        quizId: problem.quizId
                     });
                  }}
                  className="py-2 px-3 text-white rounded-lg border-2 border-gray-200"
               >
                  End Quiz
               </Button>
            </div>
         </div>
      </div>
   }

   if (status === "FINISHED") {
      return <div className="pt-24">
         <EndRoom leaderboard={leaderboard} />
         <OptionEnd socket={socket} roomId={roomId} />
      </div>
   }

   return <div className="flex justify-center pt-24">
      <div className="w-[700px] py-16 pb-8 relative">
         <div>
            <div className="flex gap-3 items-center">
               <p className="text-sm text-gray-500">Room Id: </p>
               <CopyClipboard clipboard={roomId} />
            </div>
            <div className="mt-12">
               <p className="text-sm text-gray-500 mb-5">{currentProblem} of {noOfProblems} problems</p>
               <p className="normal-case font-medium text-3xl">{problem.title}</p>
            </div>
         </div>
         <div className="flex flex-col gap-4 mt-12">
            {problem.options.map((option: Option, key: number) => {
               return <label key={key} className={`${key === problem.answer ? "border-indigo-300 text-indigo-900 bg-indigo-100 hover:bg-indigo-100" : ""} px-4 py-5 flex gap-5 border border-gray-200 rounded-xl`}>
                  <input type="radio" value={key.toString()}
                     name="answer"
                     disabled={true}
                     checked={problem.answer === key}
                     className=" w-5 ring-indigo-200"
                  />
                  <p className="text-sm">{option.choice}</p>
               </label>
            })}
         </div>
         <div className="flex justify-between items-center mt-12">
            <CountdownCircle countdown={problem.countdown} />
            <p className={`${(operation === "start-automatically") ? "block" : "hidden"} text-sm`}>This quiz is start automatically.</p>
         </div>
      </div>
   </div>
}
