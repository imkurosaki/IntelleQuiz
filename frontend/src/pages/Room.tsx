import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/Button";
import { io } from 'socket.io-client';
import Input from "../components/Input";
import Quizes from "../components/Room/Quizes";

export default function Room() {
   const { roomIdParams } = useParams();
   const [username, setUsername] = useState("");
   const [roomId, setRoomId] = useState("");
   const socket = io("ws://localhost:3000");
   const navigate = useNavigate();
   const [status, setStatus] = useState("")
   const [leaderboard, setLeaderboard] = useState([]);
   const [problem, setProblem] = useState({
      id: "",
      roomId: "",
      title: "",
      options: [],
   });
   const [userId, setUserId] = useState("");

   useEffect(() => {
      socket.on("connect", () => { })

      socket.on("resultJoin", (data: any) => {
         console.log(data);
         if (!data.success) {
            console.log(data);
            return;
         }
         setUserId(data.id);
         setStatus(data.status)
         navigate(`/room/${roomId}`)
      })

      socket.on("problem", (data: any) => {
         console.log(data)
         setProblem(data.problem);
         setStatus(data.status);
      })

      socket.on("end", (data: any) => {
         console.log("quiz is ended");
         setStatus(data.status);
      })

      socket.on("leaderboard", (data: any) => {
         setLeaderboard(data.leaderboard);
         setStatus(data.status);
      })

      return () => { socket.off("connect") }
   }, [socket])

   const handleClick = () => {
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

   if (status === "finished") {
      return <div>
         The quiz is finished
      </div>
   }

   if (status === "waiting") {
      return <div>
         Waiting for others
      </div>
   }

   if (status === "leaderboard") {
      return <div>
         Learderbaord
         {JSON.stringify(leaderboard)}
      </div>
   }

   return <Quizes userId={userId} problem={problem} socket={socket} />
}
