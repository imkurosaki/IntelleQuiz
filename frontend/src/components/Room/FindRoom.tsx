import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useSocket } from "../../lib/hooks";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorIcons } from "../../pages/admin/Register";
import JoinPage from "./JoinPage";

export default function FindRoom() {
   const [roomName, setRoomName] = useState("");
   const navigate = useNavigate();
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");
   const [error, setError] = useState("");
   const [roomsJoined, setRoomsJoined] = useState([]);

   useEffect(() => {
      // check if there is a cookie
      if (!Cookies.get('token')) {
         navigate('/admin/signin')
      }

      socket.on("error", ({ message }: { message: string }) => {
         toast(message, {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
      });

      socket.emit("GetRecentlyJoinedRooms", {}, (rooms: any) => {
         console.log(rooms);
      })

      return () => {
         socket.off("error");
      };
   }, [socket, navigate])

   return <div>
      <JoinPage socket={socket} />
      <div>

      </div>
   </div>
}
