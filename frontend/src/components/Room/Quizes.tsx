import { useState } from "react";
import { Socket } from "socket.io-client";

export type Problem = {
   roomId: string;
   title: string;
   id: string;
   options: string[];
}

export default function Quizes({ userId, problem, socket }: {
   userId: string,
   problem: Problem,
   socket: Socket
}) {
   const [answer, setAnswer] = useState("");
   const handleSubmit = () => {
      if (answer !== "") {
         socket.emit("Submit", {
            userId,
            roomId: problem.roomId,
            problemId: problem.id,
            answer: Number(answer)
         })
      }
   }

   return <div>
      <p>Room: {problem.roomId}</p>
      <p>Problem: {problem.title}</p>
      {JSON.stringify(problem.options)}

      <p>Enter answer</p>
      <input type="text" onChange={(e: any) => { setAnswer(e.target.value) }} />
      <button onClick={handleSubmit}>Submit</button>
   </div>
}
