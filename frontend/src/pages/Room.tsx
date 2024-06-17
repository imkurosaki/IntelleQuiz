import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Button from "../components/Button";
import Input from "../components/Input";
import Quizes, { Problem } from "../components/Room/Quizes";
import { toast } from "sonner";
import WaitingPage, { Participant } from "../components/Room/WaitingPage";
import Leaderboard from "../components/Room/Leaderboard";
import EndRoom from "../components/Room/EndRoom";
import { useSocket } from "../lib/hooks";
import { Socket } from "socket.io-client";
import { ParticipantInfo, participantInfo } from "../store/participant";
import { useRecoilState } from "recoil";

export default function Room() {
   const { roomIdParams } = useParams();
   const [username, setUsername] = useState("");
   const [roomId, setRoomId] = useState("");
   const navigate = useNavigate();
   const [status, setStatus] = useState("")
   const [leaderboard, setLeaderboard] = useState([]);
   const [problem, setProblem] = useState<Problem>({
      id: "",
      roomId: "",
      title: "",
      options: [],
      countdown: 0
   });
   const [userId, setUserId] = useState("");
   const [participants, setPartcipants] = useState([]);
   const [userInfo, setUserInfo] = useState({
      id: "",
      username: "",
      image: "",
      points: 0
   })
   const [noOfProblems, setNoOfProblems] = useState(0);
   const socket: Socket = useSocket();
   const [participantInfoAtom, setParticipantAtom] = useRecoilState(participantInfo);

   useEffect(() => {
      socket.on("resultJoin", (data: ParticipantInfo) => {
         console.log(data);
         if (!data.success) {
            console.log(data);
            toast.error(data.error);
            return;
         }
         setParticipantAtom(data);

         setUserId(data.id);
         setStatus(data.status)
         setNoOfProblems(data.problems.length || 0);
         navigate(`/room/${data.roomId}`)
      })

      socket.on("problem", ({ problem, status }: {
         problem: Problem,
         status: string,
      }) => {
         console.log(problem)
         setProblem(problem);
         setStatus(status);
      })

      socket.on("end", (data: any) => {
         console.log("quiz is ended");
         setStatus(data.status);
         setLeaderboard(data.leaderboard)
      })

      socket.on("leaderboard", (data: any) => {
         setLeaderboard(data.leaderboard);
         setStatus(data.status);
      })

      socket.on("participants", (data: any) => {
         setPartcipants(data.participants);
      })

      return () => {
         socket.off("resultJoin")
      }
   }, [socket, navigate, setParticipantAtom]);

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
               <Button
                  onClick={handleClick}
                  className="py-4 w-full text-white rounded-full border-2 border-gray-200"
               >
                  Join
               </Button>
            </div>
         </div>
      </div>
   }

   if (status === "finished") {
      return <div>
         <EndRoom leaderboard={leaderboard} />
         <div className="flex justify-end mt-20 pe-[560px]">
            <button className="bg-gray-900 hover:bg-gray-800 px-8 py-3 text-white rounded-md"
               onClick={() => {
                  socket.emit("leaveRoom", {
                     roomId
                  })
                  navigate("/room")
               }}
            >Exit</button>
         </div>
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

      console.log("participasnts " + JSON.stringify(participantInfoAtom));

      return <WaitingPage
         user={userInfo}
         participants={participants.filter((participant: Participant) => {
            return participant.username !== username
         })}
         noOfProblems={noOfProblems}
      />
   }

   if (status === "leaderboard") {
      return <div>
         <Leaderboard leaderboard={leaderboard} />
      </div>
   }

   return <Quizes userId={userId} problem={problem} socket={socket} />
}
