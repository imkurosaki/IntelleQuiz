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
import { ParticipantInfo, participantInfo, userJoinInfo } from "../store/participant";
import { useRecoilState, useRecoilValue } from "recoil";
import JoinPage from "../components/Room/JoinPage";
import Cookies from "js-cookie";

export default function Room() {
   const { roomIdParams } = useParams();
   // const [username, setUsername] = useState("");
   // const [roomId, setRoomId] = useState("");
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
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");
   const [participantInfoAtom, setParticipantAtom] = useRecoilState(participantInfo);
   const userJoinInfoAtom = useRecoilValue(userJoinInfo);

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

   // const handleJoinSubmit = () => {
   //    socket.emit("JoinUser", {
   //       username,
   //       roomId
   //    })
   // }

   if (!roomIdParams || !status) {
      return <JoinPage socket={socket} />
   }

   if (status === "finished") {
      return <div>
         <EndRoom leaderboard={leaderboard} />
         <div className="flex justify-end mt-20 pe-[560px]">
            <button className="bg-gray-900 hover:bg-gray-800 px-8 py-3 text-white rounded-md"
               onClick={() => {
                  socket.emit("leaveRoom", {
                     roomId: userJoinInfoAtom.roomId
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
            if (participant.username === userJoinInfoAtom.username) {
               setUserInfo(participant);
               return;
            }
         })
      }

      console.log("participasnts " + JSON.stringify(participantInfoAtom));

      return <WaitingPage
         user={userInfo}
         participants={participants.filter((participant: Participant) => {
            return participant.username !== userJoinInfoAtom.username
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
