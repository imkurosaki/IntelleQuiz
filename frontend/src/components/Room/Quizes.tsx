import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Button from "../Button";
import { CountdownCircle } from "../CountdownCircle";
import { Option } from "../../pages/admin/Started";
import { CopyClipboard } from "../Accordion";
import { ErrorIcons } from "../../pages/admin/Register";
import { toast } from "sonner";

export type ParticipantProblem = {
   title: string;
   id: string;
   options: Option[];
   answer: number;
   countdown: number;
   quizId: string;
}

export default function Quizes({ quizId, pointsId, problem, roomId, socket, currentProblem, noOfProblems }: {
   quizId: string,
   pointsId: string,
   problem: ParticipantProblem,
   roomId: string,
   currentProblem: number,
   noOfProblems: number,
   socket: Socket
}) {
   const answer = useRef("0");
   const [disabled, setDisable] = useState(false);
   const [change, setChange] = useState("0");

   const handleSubmit = (e: any) => {
      e.preventDefault()
      console.log(quizId)
      setDisable(true)
      console.log(answer)
      if (answer.current !== "") {
         socket.emit("Submit", {
            roomId,
            quizId,
            pointsId,
            problemId: problem.id,
            answer: Number(answer.current),
         }, (res: any) => {
            toast(res.message, {
               className: "bg-gray-950 text-white",
               duration: 5000,
               icon: <ErrorIcons />
            });
            return;
         })
      }
   }

   useEffect(() => {
      setDisable(false);
      answer.current = "0"
      setChange("0")
   }, [problem])

   return <div className="flex justify-center">
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

         <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-12">
            {problem.options.map((option: Option, key: number) => {
               return <label key={key} className={`${key.toString() === change ? "border-indigo-300 text-indigo-900 bg-indigo-100 hover:bg-indigo-100" : ""} ${!disabled || key.toString() === change ? "hover:bg-gray-100" : "hover:bg-white cursor-auto"} px-4 py-5 flex gap-5 cursor-pointer  border border-gray-200 rounded-xl`}>
                  <input type="radio" value={key.toString()}
                     onChange={(e: any) => {
                        answer.current = e.target.value
                        setChange(e.target.value.toString())
                     }}
                     checked={answer.current === key.toString()}
                     name="answer"
                     disabled={disabled}
                     className="cursor-pointer w-5 ring-indigo-200"
                  />
                  <p className="text-sm">{option.choice}</p>
               </label>
            })}
            <div className="w-72 mt-4">
               <Button
                  onClick={handleSubmit}
                  disabled={disabled}
                  className="py-4 w-full text-white rounded-full border-2 border-gray-200"
               >
                  {disabled ? "Submitted" : "Submit"}
               </Button>
            </div>
         </form>
         <div className="absolute right-0 bottom-0">
            <CountdownCircle countdown={problem.countdown} />
         </div>
      </div>
   </div >
}
