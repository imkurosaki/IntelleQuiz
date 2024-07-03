import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../lib/hooks.ts";
import { Socket } from "socket.io-client";
import Input from "../../components/Input.tsx";
import Button from "../../components/Button.tsx";
import { toast } from "sonner";
import { ErrorIcons } from "./Register.tsx";
import QuizControl from "./QuizControl.tsx";
import Cookies from 'js-cookie'
import Leaderboard from "../../components/Room/Leaderboard.tsx";
import { CopyClipboard } from "../../components/Accordion.tsx";
import { Participant } from "../../components/Room/WaitingPage.tsx";
import OptionEnd from "./OptionEnd.tsx";
import LeaderBoardSkeleton from "../../components/Skeleton/LeaderboardSkeleton.tsx";

export default function AddProblem() {
   const { roomIdParams } = useParams();
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");
   const navigate = useNavigate();
   const [count, setCount] = useState(4);
   const [options, setOptions] = useState(["", "", "", ""]);
   const [title, setTitle] = useState("");
   const answer = useRef<number>(0);
   const countdown = useRef<number>(10);
   const isReady = useRef<boolean>(true);
   const [quizId, setQuizId] = useState("");
   const [roomId, setRoomId] = useState("");
   const [status, setStatus] = useState("");
   const [leaderboard, setLeaderBoards] = useState<Participant[]>([])
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (!Cookies.get('token')) {
         navigate('/signin')
      }

      socket.emit("roomId", { roomId: roomIdParams }, async (response: any) => {
         if (response.status === "error") {
            navigate('/room');
            return;
         }
         if (response.room.status === "FINISHED") {
            setStatus("FINISHED");
            setLeaderBoards(response.leaderboard);
            await new Promise(resolve => setTimeout(resolve, 2000));
         }
         setIsLoading(false);
         setQuizId(response.room.quizes[0].id);
         setRoomId(response.room.quizes[0].roomId);
      })

      socket.on("success", ({ message }: {
         message: string
      }) => {
         toast.success(message, {
            duration: 5000,
         })
      })

      socket.on("leaderboard", ({ leaderboard, status }: {
         leaderboard: Participant[],
         status: string
      }) => {
         setStatus(status);
         setLeaderBoards(leaderboard);
      })

      socket.on("error", ({ message }: { message: string }) => {
         toast(message, {
            className: "bg-gray-950 text-white border border-gray-50",
            duration: 5000,
            icon: <ErrorIcons />
         })
      });

      return () => {
         socket.off("success")
         socket.off("error")
         socket.off("leaderboard")
      };
   }, [navigate, socket, roomIdParams]);

   const addProblemHandler = (choice: number, problem: string) => {
      const newOptions: string[] = [...options];

      if (choice > options.length) {
         newOptions.push(problem);
      } else {
         newOptions[choice] = problem;
      }
      setOptions([...newOptions]);
   }

   const answerHandler = (e: any) => {
      answer.current = Number(e.target.value);
   }

   const displayInput = () => {
      const elements = [];
      const choices = ["Venus", "Universe", "Mars", "Multiverse"]
      for (let i = 0; i < count; i++) {
         elements.push(<InputProblem key={i} choice={i} placeholder={choices[i]} value={options[i]} onAnswer={answerHandler} onChange={addProblemHandler} />)
      }
      return <div className="flex flex-col gap-4">{elements}</div>;
   }

   const submitProblemsHandler = () => {
      for (let i = 0; i < count; i++) {
         if (options[i] === "" || options[i] === undefined) {
            toast("Please fill the necessary blank", {
               className: "bg-gray-950 text-white border border-gray-50",
               duration: 5000,
               icon: <ErrorIcons />
            })
            return;
         }
      }

      if (!options[answer.current] || title === "" || countdown.current === 0) {
         toast("Please fill the necessary blank", {
            className: "bg-gray-950 text-white border border-gray-50",
            duration: 5000,
            icon: <ErrorIcons />
         })
         return;
      }
      setCount(4)

      socket.emit("addProblem", {
         quizId,
         title,
         options,
         answer: answer.current,
         countdown: countdown.current,
      })
      setOptions(["", "", "", ""])
      setTitle("")
      isReady.current = false;
   }

   if (isLoading && status === "FINISHED") {
      return <div className="pt-36">
         <LeaderBoardSkeleton />
      </div>
   }

   if (status === "FINISHED") {
      return <div className="pt-20">
         <Leaderboard leaderboard={leaderboard} />
         <OptionEnd socket={socket} roomId={roomId} />
      </div>
   }

   return <div className="flex justify-center pt-10">
      <div className="w-[1000px] py-20">
         <div className="flex gap-3">
            <p className="text-sm text-gray-500">Room Id: </p>
            <CopyClipboard clipboard={roomId} />
         </div>
         <div className="mt-12">
            <p className="mb-2">Problem Title</p>
            <Input
               placeholder="Where is the sun located?"
               type="text"
               value={title || ""}
               onChange={(e: any) => { setTitle(e.target.value) }}
            />
         </div>
         <div className="mt-10">
            {displayInput()}
         </div>
         <div className="flex justify-center mt-10">
            <div className="flex gap-4">
               {/* plus icon */}
               <svg onClick={() => {
                  setOptions([...options, ""]);
                  setCount(count => count + 1)
               }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 w-12 h-12 border-2 p-3 rounded-full cursor-pointer hover:border">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
               </svg>

               {/* minus icon */}
               <svg onClick={() => {
                  if (count > 2) {
                     setOptions(options.slice(0, -1));
                     setCount(count => count - 1);
                  }
               }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-4 w-12 h-12 border-2 p-3 rounded-full cursor-pointer hover:border">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
               </svg>
            </div>
         </div>
         <div className="flex justify-between items-end px-4">
            <div className="text-center ms-10">
               <p className="text-sm text-gray-500 mb-3">Timer</p>
               <input
                  type={"text"}
                  placeholder={countdown.current.toString()}
                  onChange={(e: any) => { countdown.current = Number(e.target.value) }}
                  className={`text-gray-900 py-3 px-4 w-16 border border-gray-200 bg-gray-100 rounded-xl`}
               />
            </div>
            <div>
               <Button
                  onClick={submitProblemsHandler}
                  className="py-2 px-4 text-white rounded-lg border-2 border-gray-200"
               >
                  Add problem
               </Button>
            </div>
         </div>
         <div className="mt-12">
            <QuizControl isReady={isReady.current} quizId={quizId} roomId={roomId} />
         </div>
      </div>
   </div>
}

export function InputProblem({ choice, onChange, onAnswer, placeholder, value }: {
   choice: number,
   placeholder: string,
   onChange: any,
   onAnswer: any,
   value: string,
}) {
   return <label className={`px-4 flex gap-5 cursor-pointer`}>
      <input type="radio" value={choice.toString()}
         onClick={onAnswer}
         name="answer"
         className="cursor-pointer w-5 ring-indigo-200"
      />
      <div className="w-full">
         <Input
            placeholder={placeholder || `choice ${choice + 1}`}
            type="text"
            value={value || ""}
            onChange={(e: any) => {
               onChange(choice, e.target.value);
            }}
         />
      </div>
   </label>
} 
