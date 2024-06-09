import { useState } from "react";
import { Socket } from "socket.io-client";

export type Problem = {
   roomId: string;
   title: string;
   id: string;
   options: string[];
}

export default function Quizes({ problem, socket }: {
   problem: Problem,
   socket: Socket
}) {
   const [answer, setAnswer] = useState("");
   const handleSubmit = () => {
      if (answer !== "") {
         socket.emit("Submit", {
            answer: Number(answer)
         })
      }
   }

   return <div>
      <p>Room: {problem.id}</p>
      <p>Problem: {problem.title}</p>
      {JSON.stringify(problem.options)}

      <p>Enter answer</p>
      <input type="text" onChange={(e: any) => { setAnswer(e.target.value) }} />
      <button onClick={handleSubmit}>Submit</button>
   </div>
}
