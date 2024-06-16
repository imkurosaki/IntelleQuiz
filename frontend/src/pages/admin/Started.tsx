import { useEffect, useState } from "react"
import { useSocket } from "../../lib/hooks"
import { Socket } from "socket.io-client";
import { CountdownCircle } from "../../components/CountdownCircle";
import Button from "../../components/Button";
import { Participant } from "../../components/Room/WaitingPage";
import Leaderboard from "../../components/Room/Leaderboard";
import { useRecoilValue } from "recoil";
import { AdminInfo, adminInfo } from "../../store";
import Modal from "../../components/Modal";

export type AdminProblem = {
   roomId: string;
   title: string;
   id: string;
   options: string[];
   answer: number;
   countdown: number;
}

export default function Started() {
   const socket: Socket = useSocket();
   const [problem, setProblem] = useState<AdminProblem>({
      id: "",
      roomId: "",
      title: "",
      options: [],
      answer: 0,
      countdown: 0,
   })
   const [operation, setOperation] = useState<string>("manually");
   const [status, setStatus] = useState("")
   const [leaderboard, setLeaderBoards] = useState<Participant[]>([])
   const adminInfoAtom = useRecoilValue<AdminInfo>(adminInfo);
   const [modal, setModal] = useState(true);
   const [isModalOpen, setModalOpen] = useState(false);
   const setIsModalOpen = () => {
      setModalOpen(false)
   }

   useEffect(() => {
      socket.on("adminProblem", ({ problem, status, index }: {
         problem: AdminProblem,
         status: string,
         index: number
      }) => {
         console.log(status)
         setProblem(problem)
         setStatus(status);
         if (index === (adminInfoAtom.currentRoom.noOfProblems - 1)) {
            console.log("LIMIT")
            setModal(false);
         }
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

      return () => {
         socket.off("adminProblem");
         socket.off("operation")
         socket.off("leaderboard")
      }
   }, [socket, adminInfoAtom])


   if (status === "leaderboard") {
      return <div className="flex flex-col items-center">
         <Leaderboard leaderboard={leaderboard} />
         <div className="mt-12 flex gap-2">
            <Button
               onClick={() => {
                  if (!modal) {
                     setModalOpen(true)
                     return;
                  }
                  socket.emit("next", {
                     roomId: problem.roomId
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
                     roomId: problem.roomId
                  })
               }}
               className="py-2 px-3 text-white rounded-lg border-2 border-gray-200"
            >
               End Quiz
            </Button>
         </div>
         <Modal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
   }

   return <div className="flex justify-center">
      <div className="w-[700px] py-16 pb-8 relative">
         <div>
            <p className="text-xs font-thin">Present Room: {problem.roomId}</p>
            <p className="normal-case font-medium text-3xl">{problem.title}</p>
         </div>

         <div className="flex flex-col gap-4 mt-12">
            {problem.options.map((option: string, key: any) => {
               return <label key={key} className={`${key === problem.answer ? "border-indigo-300 text-indigo-900 bg-indigo-100 hover:bg-indigo-100" : ""} px-4 py-5 flex gap-5 border border-gray-200 rounded-xl`}>
                  <input type="radio" value={key.toString()}
                     name="answer"
                     disabled={true}
                     checked={problem.answer === key}
                     className=" w-5 ring-indigo-200"
                  />
                  <p className="text-sm">{option}</p>
               </label>
            })}
         </div>
         <div className="flex justify-between items-center mt-12">
            <CountdownCircle countdown={problem.countdown} />
            <p className={`${(operation === "start-automatically") ? "block" : "hidden"} text-sm`}>This quiz is start automatically.</p>
         </div>
         <p>{adminInfoAtom.currentRoom.noOfProblems}</p>
      </div>
   </div>
}
