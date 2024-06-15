import Input from "../../components/Input";
import Button from "../../components/Button";
import Accordion from "../../components/Accordion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ErrorIcons } from "./Register";
import { useSocket } from "../../lib/hooks";
import { Socket } from "socket.io-client";
import { AdminInfo, adminInfo } from "../../store";
import { useRecoilState } from "recoil";

export default function AddRoom() {
   const [disable, setDisable] = useState(true);
   const [roomId, setRoomId] = useState("");
   const [roomName, setRoomName] = useState("");
   const navigate = useNavigate();
   const socket: Socket = useSocket();
   const [adminInfoAtom, setAdminInfoAtom] = useRecoilState<AdminInfo>(adminInfo);

   const submitHandler = () => {
      if (!roomName) {
         toast("Please enter a roomName", {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
         return;
      }
      setDisable(false);

      socket.emit("addRoom", {
         roomName
      })
   }

   useEffect(() => {
      socket.on("error", ({ error }: { error: string }) => {
         toast(error, {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
      });

      socket.on("room", ({ message, roomId }: {
         message: string,
         roomId: string
      }) => {
         toast.success(message, {
            duration: 5000
         });
         setRoomId(roomId)
         setAdminInfoAtom({
            username: adminInfoAtom.username,
            currentRoom: roomId
         })
      })

      return () => {
         socket.off("error");
         socket.off("room");
      };
   }, [socket])

   return <div className="flex justify-center h-screen items-center">
      <div className="w-[500px] border border-gray-200 shadow-md px-10 py-14 rounded-lg">
         <div>
            <p className="mb-4">Room Name</p>
            <Input
               type="text"
               placeholder="Enter room name"
               onChange={(e: any) => {
                  setRoomName(e.target.value);
               }}
            />
         </div>
         <Accordion title="Room Id" roomId={roomId} />
         <div className="flex justify-end mt-8 gap-4">
            <Button
               onClick={submitHandler}
               className="py-2 px-4 text-white rounded-lg border-2 border-gray-200"
            >
               Submit
            </Button>
            <Button
               onClick={() => {
                  if (!roomId) {
                     console.log("error dont have roomId")
                     return;
                  }
                  navigate(roomId);
               }}
               className="py-2 px-4 text-white rounded-lg border border-gray-100"
               disabled={disable}
            >
               Next
            </Button>
         </div>
      </div>
   </div>
}

