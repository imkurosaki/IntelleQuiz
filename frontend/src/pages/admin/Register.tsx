import { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { AdminInfo, adminInfo } from "../../store";
import { useSocket } from "../../lib/hooks";
import { Socket } from "socket.io-client";

export default function Register() {
   const [username, setUsername] = useState("");
   const navigate = useNavigate();
   const setAdminInfo = useSetRecoilState<AdminInfo>(adminInfo);
   const socket: Socket = useSocket();

   const onClickHandler = () => {
      if (!username) {
         toast("Please enter a username", {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
         return;
      }

      socket.emit("Admin", {
         username
      });
      setAdminInfo({
         username,
         currentRoom: {
            id: '',
            noOfProblems: 0
         }
      });
      navigate("/admin/room");
   }

   useEffect(() => {
      socket.on("error", ({ error }: { error: string }) => {
         toast(error, {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
      });

      return () => { socket.off("error") }
   }, [socket])

   return <div className="flex justify-center h-screen items-center">
      <div className="w-[500px] border border-gray-200 shadow-md px-10 py-14 rounded-lg">
         <div>
            <p className="mb-4">Username</p>
            <Input
               type="text"
               placeholder="Enter username"
               onChange={(e: any) => {
                  setUsername(e.target.value);
               }}
            />
         </div>
         <div className="flex justify-end mt-8">
            <Button
               onClick={onClickHandler}
               className="py-3 px-4 text-white rounded-lg border-2 border-gray-200"
            >
               Register
            </Button>
         </div>
      </div>
   </div>
}

export function ErrorIcons() {
   return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
   </svg>
}
