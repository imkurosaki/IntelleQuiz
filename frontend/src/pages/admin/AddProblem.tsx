import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../lib/hooks";
import { Socket } from "socket.io-client";
import { AdminInfo, adminInfo } from "../../store";
import { useRecoilState, useRecoilValue } from "recoil";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "sonner";
import { ErrorIcons } from "./Register";
import QuizControl from "./QuizControl";

export default function AddProblem() {
   // const { roomIdParams } = useParams();
   const socket: Socket = useSocket();
   const navigate = useNavigate();
   const [adminInfoAtom, setAdminInfoAtom] = useRecoilState<AdminInfo>(adminInfo);
   const [count, setCount] = useState(4);
   const [options, setOptions] = useState(["", "", "", ""]);
   const [title, setTitle] = useState("");
   const answer = useRef<number>(0);
   const countdown = useRef<number>(10);
   const isReady = useRef<boolean>(true);

   useEffect(() => {
      if (!adminInfoAtom.currentRoom.id || !adminInfoAtom.username) {
         navigate('admin/register');
      }

      socket.on("success", ({ message }: {
         message: string
      }) => {
         toast.success(message, {
            duration: 5000,
         })
      })

      return () => {
         socket.off("success")
      };
   }, [adminInfoAtom, navigate, socket]);

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
            console.log("Errror");
            toast("Please fill the necessary blank", {
               className: "bg-gray-950 text-white",
               duration: 5000,
               icon: <ErrorIcons />
            })
            return;
         }
      }

      if (!options[answer.current] || title === "" || countdown.current === 0) {
         console.log(options)
         console.log("Errror");
         toast("Please fill the necessary blank", {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
         return;
      }
      setCount(4)
      console.log(answer.current)
      console.log(countdown.current)
      console.log(options)

      socket.emit("addQuiz", {
         roomId: adminInfoAtom.currentRoom.id,
         title,
         options,
         answer: answer.current,
         countdown: countdown.current,
      })
      setOptions(["", "", "", ""])
      setTitle("")
      setAdminInfoAtom({
         username: adminInfoAtom.username,
         currentRoom: {
            id: adminInfoAtom.currentRoom.id,
            noOfProblems: adminInfoAtom.currentRoom.noOfProblems + 1
         }
      })
      isReady.current = false;
   }

   return <div className="flex justify-center">
      <div className="w-[1000px] py-20">
         <p className="text-sm text-gray-500">Room Id: <span className="px-4 py-1 bg-gray-200 text-xs text-gray-700 rounded-md border border-gray-300">{adminInfoAtom.currentRoom.id}</span></p>
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
                     console.log(options)
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
                  className="py-3 px-4 w-16 border border-gray-200 bg-gray-100 rounded-xl"
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
            <QuizControl isReady={isReady.current} />
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
