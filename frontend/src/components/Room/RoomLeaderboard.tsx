import { useEffect, useState } from "react"
import { Participant } from "./WaitingPage"
import { useSocket } from "../../lib/hooks";
import { Socket } from "socket.io-client";
import Cookies from 'js-cookie';
import { useNavigate, useParams } from "react-router-dom";
import EndRoom from "./EndRoom";

export default function RoomLeaderboard() {
   const { quizId } = useParams();
   const [leaderboard, setLeaderboard] = useState<Participant[]>([]);
   const navigate = useNavigate();
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");

   useEffect(() => {
      // check if there is a cookie
      if (!Cookies.get('token')) {
         navigate('/signin');
      }

      socket.emit("GetLeaderboad", { quizId }, (res: any) => {
         if (res.status === "error") {
            console.log("Authentication Error");
            return;
         }
         setLeaderboard(res);
      })
   }, [socket, quizId, navigate]);

   return <div>
      <EndRoom leaderboard={leaderboard} />
      <div className="flex justify-end mt-20 pe-[560px]">
         <button className="bg-gray-900 hover:bg-gray-800 px-8 py-3 text-white rounded-md"
            onClick={() => {
               navigate("/findRoom");
            }}
         >Exit</button>
      </div>
   </div>
}
