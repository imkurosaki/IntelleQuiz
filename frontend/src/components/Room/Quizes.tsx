import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Button from "../Button";
import { CountdownCircle } from "../CountdownCircle";

export type Problem = {
   roomId: string;
   title: string;
   id: string;
   answer?: number;
   options: string[];
   countdown: number;
}

export default function Quizes({ userId, problem, socket }: {
   userId: string,
   problem: Problem,
   socket: Socket
}) {
   const answer = useRef("0");
   const [disabled, setDisable] = useState(false);
   const [change, setChange] = useState("0");
   const handleSubmit = (e: any) => {
      e.preventDefault()
      setDisable(true)
      console.log(answer)
      if (answer.current !== "") {
         socket.emit("Submit", {
            userId,
            roomId: problem.roomId,
            problemId: problem.id,
            answer: Number(answer.current),
            countdown: problem.countdown
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
            <p className="text-xs font-thin">Present Room: {problem.roomId}</p>
            <p className="normal-case font-medium text-3xl">{problem.title}</p>
         </div>

         <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-12">
            {problem.options.map((option: string, key: any) => {
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
                  <p className="text-sm">{option}</p>
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
