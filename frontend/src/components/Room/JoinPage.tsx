import { useSetRecoilState } from "recoil";
import Button from "../Button";
import Input from "../Input";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { joinInput } from "../../zod/userValidation";
import { toast } from "sonner";
import { ErrorIcons } from "../../pages/admin/Register";
import { useNavigate } from "react-router-dom";
import { currentRoomJoined } from "../../store/admin";

export default function JoinPage({ socket }: {
   socket: Socket
}) {
   const [roomId, setRoomId] = useState("");
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const setCurrentRoomJoinedState = useSetRecoilState(currentRoomJoined);

   const handleJoinSubmit = () => {
      const validation: any = joinInput.safeParse({ roomId });
      if (!validation.success) {
         const errors: any = JSON.parse(validation.error.message);
         setError(errors[0].message);

         setTimeout(() => {
            setError("")
         }, 3000)
         return;
      }

      socket.emit("JoinRoom", {
         roomId
      }, (res: any) => {
         if (res.status === "error") {
            toast(res.message, {
               className: "bg-gray-950 text-white",
               duration: 5000,
               icon: <ErrorIcons />
            });
            return;
         }
         setCurrentRoomJoinedState(res.data);
         navigate(`/findRoom/${roomId}`);
      });
   }

   return <div className="flex w-full">
      <div className="w-full">
         <div className="text-center">
            <p className="text-lg text-gray-700">Enter the code to join</p>
            <p className="text-sm text-gray-600">It's on the screen in front of you</p>
         </div>
         <div className={`${error !== "" ? "block vibrate" : "hidden"} border border-gray-400 rounded-lg text-center py-3 px-2 mt-2 bg-red-700 text-sm text-white w-full shadow-lg`}>{error}</div>
         <div className="flex flex-col gap-3 mt-5">
            <Input placeholder="1234 5678" type="text" onChange={(e: any) => setRoomId(e.target.value)} />
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
