import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Input from "../components/Input";
import Button from "../components/Button";
import { io } from 'socket.io-client';

export default function Room() {
   const { roomIdParams } = useParams();
   const [username, setUsername] = useState("");
   const [roomId, setRoomId] = useState("");
   const socket = io("ws://localhost:3000");

   useEffect(() => {
      socket.on("connect", () => { })

      socket.on("error", (data: any) => {
         console.log("error")
         console.log(data);
      })

      if (roomId) {
         socket.on("problem", (data: any) => {
            console.log(data)
         })
      }

      return () => { socket.off("connect") }
   }, [socket])

   const handleClick = () => {
      console.log(username)
      socket.emit("JoinUser", {
         username,
         roomId
      })
   }

   if (!roomIdParams) {
      return <div>
         <Input label="username" type="text" onChange={(e: any) => setUsername(e.target.value)} />
         <Input label="room Id" type="text" onChange={(e: any) => setRoomId(e.target.value)} />
         <Button label="Join" onClick={handleClick} />
      </div>
   }

   return <div>
      Enter room for users {roomId}
   </div>
}
