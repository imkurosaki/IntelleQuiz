import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../../lib/hooks";
import { Socket } from "socket.io-client";
import { AdminInfo, adminInfo } from "../../store";
import { useRecoilValue } from "recoil";
import Input from "../../components/Input";

export default function AddProblem() {
   // const { roomIdParams } = useParams();
   const socket: Socket = useSocket();
   const navigate = useNavigate();
   const adminInfoAtom = useRecoilValue<AdminInfo>(adminInfo);
   const [count, setCount] = useState(4);

   useEffect(() => {
      if (!adminInfoAtom.currentRoom || !adminInfoAtom.username) {
         navigate('admin/register');
      }
   }, [adminInfoAtom, navigate]);

   const inputProblem = () => {
      const elements = [];
      for (let i = 0; i < count; i++) {
         elements.push(<InputProblem key={i} choice={i} />)
      }
      return <div>{elements}</div>;
   }

   return <div>
      <p>Room Id: {adminInfoAtom.currentRoom}</p>
      <div>
         <p>Problem Title</p>
         <Input
            placeholder="Where is the sun located?"
            type="text"
            onChange={() => { }}
         />
      </div>
      {inputProblem()}
      <div>
         <button onClick={() => { setCount(count => count + 1) }}>Add problem</button>
         <button onClick={() => {
            if (count > 2) setCount(count => count - 1);
         }}>Decrease problem</button>
      </div>
   </div>
}

export function InputProblem({ choice }: {
   choice: number,
}) {
   return <label className={`px-4 flex gap-5 cursor-pointer`}>
      <input type="radio" value={choice.toString()}
         onClick={(e: any) => {
         }}
         name="answer"
         className="cursor-pointer w-5 ring-indigo-200"
      />
      <div className="w-full">
         <Input
            placeholder=""
            type="text"
            onChange={() => { }}
         />
      </div>
   </label>
} 
