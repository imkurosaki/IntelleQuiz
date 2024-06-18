import { useSetRecoilState } from "recoil";
import Button from "../Button";
import Input from "../Input";
import { participantInfo, userJoinInfo } from "../../store/participant";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { joinInput } from "../../zod/userValidation";

export default function JoinPage({ socket }: {
   socket: Socket
}) {
   const [username, setUsername] = useState("");
   const [roomId, setRoomId] = useState("");
   const setUserJoinInfo = useSetRecoilState(userJoinInfo);
   const [error, setError] = useState("");

   const handleJoinSubmit = () => {
      const validation: any = joinInput.safeParse({ roomId, username });
      if (!validation.success) {
         const errors: any = JSON.parse(validation.error.message);
         setError(errors[0].message);

         setTimeout(() => {
            setError("")
         }, 3000)
         return;
      }

      socket.emit("JoinUser", {
         username,
         roomId
      })

      setUserJoinInfo({
         roomId,
         username
      })
   }

   return <div className="flex justify-center items-center h-screen w-full">
      <div className="w-[300px]">
         <div className="text-center">
            <p className="text-lg text-gray-700">Enter the code to join</p>
            <p className="text-sm text-gray-600">It's on the screen in front of you</p>
         </div>
         <div className={`${error !== "" ? "block vibrate" : "hidden"} border border-gray-400 rounded-lg text-center py-3 px-2 mt-2 bg-red-700 text-sm text-white w-full shadow-lg`}>{error}</div>
         <div className="flex flex-col gap-3 mt-5">
            <Input placeholder="1234 5678" type="text" onChange={(e: any) => setRoomId(e.target.value)} />
            <Input placeholder="Your name" type="text" onChange={(e: any) => setUsername(e.target.value)} />
         </div>
         <div className="px-10 mt-8">
            <Button
               onClick={handleJoinSubmit}
               className="py-4 w-full text-white rounded-full border-2 border-gray-200"
            >
               Join
            </Button>
         </div>
      </div>
   </div>
}
