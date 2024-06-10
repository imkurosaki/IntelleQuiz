import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/Button";
import { Socket, io } from 'socket.io-client';
import Input from "../components/Input";
import Quizes from "../components/Room/Quizes";
import { toast } from "sonner";
import WaitingPage, { Participant } from "../components/Room/WaitingPage";

const socket = io("ws://localhost:3000");

export default function Room() {
   const { roomIdParams } = useParams();
   const [username, setUsername] = useState("");
   const [roomId, setRoomId] = useState("");
   // const socket = io("ws://localhost:3000");
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
   const [participants, setPartcipants] = useState([]);
   const [userInfo, setUserInfo] = useState({
      id: "",
      username: "",
      image: "",
      points: 0
   })

   useEffect(() => {
      socket.on("connect", () => { })

      socket.on("resultJoin", (data: any) => {
         console.log(data);
         if (!data.success) {
            console.log(data);
            toast.error(data.error);
            return;
         }
         setUserId(data.id);
         setStatus(data.status)
         navigate(`/room/${data.roomId}`)
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

      socket.on("participants", (data: any) => {
         setPartcipants(data.participants);
      })

      return () => { socket.off("connect") }
   }, [])

   const handleClick = () => {
      socket.emit("JoinUser", {
         username,
         roomId
      })
   }

   if (!roomIdParams || !status) {
      return <div className="flex justify-center items-center h-screen w-full">
         <div className="w-[300px]">
            <div className="text-center">
               <p className="text-lg text-gray-700">Enter the code to join</p>
               <p className="text-sm text-gray-600">It's on the screen in front of you</p>
            </div>
            <div className="flex flex-col gap-3 mt-5">
               <Input placeholder="1234 5678" type="text" onChange={(e: any) => setRoomId(e.target.value)} />
               <Input placeholder="Your name" type="text" onChange={(e: any) => setUsername(e.target.value)} />
            </div>
            <div className="px-10 mt-8">
               <Button label="Join" onClick={handleClick} />
            </div>
         </div>
      </div>
   }

   if (status === "finished") {
      return <div>
         The quiz is finished
      </div>
   }

   if (status === "waiting") {
      if (userInfo.id === "") {
         participants.map((participant: Participant) => {
            if (participant.username === username) {
               setUserInfo(participant);
               return;
            }
         })
      }

      return <WaitingPage
         user={userInfo}
         participants={participants.filter((participant: Participant) => {
            return participant.username !== username
         })}
      />
   }

   if (status === "leaderboard") {
      return <div>
         Learderbaord
         {JSON.stringify(leaderboard)}
      </div>
   }

   return <Quizes userId={userId} problem={problem} socket={socket} />
}
