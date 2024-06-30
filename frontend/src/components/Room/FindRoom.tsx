import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { useSocket } from "../../lib/hooks";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorIcons } from "../../pages/admin/Register";
import JoinPage from "./JoinPage";
import { StatusCircle } from "../RoomCard";
import FindRoomSkeleton from "../Skeleton/FindRoomSkeleton";
import { ThemeContext } from "../../contexts";
import { ThemeContextInterface } from "../../lib/types";

export default function FindRoom() {
   const navigate = useNavigate();
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");
   const [roomsJoined, setRoomsJoined] = useState([]);
   const [loading, setLoading] = useState(true);
   const { darkTheme, toggleTheme } = useContext(
      ThemeContext
   ) as ThemeContextInterface;

   useEffect(() => {
      // check if there is a cookie
      if (!Cookies.get('token')) {
         navigate('/signin')
      }

      socket.on("error", ({ message }: { message: string }) => {
         toast(message, {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
      });

      socket.emit("GetRecentlyJoinedRooms", {}, async ({ joinedRooms }: {
         joinedRooms: any
      }) => {
         setRoomsJoined(joinedRooms);
         setLoading(false);
      })

      return () => {
         socket.off("error");
      };
   }, [socket, navigate])

   return <div className="px-32 py-10">
      <div className="flex justify-center mb-16">
         <div className="w-[400px]">
            <JoinPage socket={socket} />
         </div>
      </div>
      <div className="h-[650px] overflow-auto border border-gray-700 px-10 py-5 rounded-lg">
         <p className="mb-8">Recently Joined Rooms: </p>
         {loading ? (
            <FindRoomSkeleton />
         ) : (
            <div className="flex flex-col gap-4">
               {!roomsJoined.length ? (
                  <p className={`${darkTheme ? "bg-white hover:bg-white text-black" : ""} bg-gray-200 border border-gray-200 px-10 py-5 rounded-lg text-sm`}>No recently joined room.</p>
               ) : (
                  roomsJoined.map((room: any, key: number) => (
                     <JoinRoomCard
                        key={key}
                        roomName={room.name}
                        roomId={room.id}
                        status={room.status}
                        quizId={room.quizes[0].id}
                        score={room.quizes[0].points[0].points}
                        adminName={room.admin.username}
                     />
                  ))
               )}
            </div>
         )}
      </div>
   </div>
}

export function JoinRoomCard({ roomName, roomId, quizId, status, score, adminName }: {
   roomName: string,
   roomId: string,
   quizId: string,
   status: string,
   score: number,
   adminName: string
}) {
   const navigate = useNavigate();
   const { darkTheme, toggleTheme } = useContext(
      ThemeContext
   ) as ThemeContextInterface;

   return <div
      onClick={() => {
         navigate(`${quizId}/leaderboard`)
      }}
      className={`${darkTheme ? "text-black" : ""} flex justify-between border border-gray-300 px-14 py-4 rounded-xl shadow-md cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg p-4 bg-gray-200 hover:bg-gray-900 hover:text-white`}>
      <div className="flex gap-10 items-center">
         <div className="mt-2">
            <p className="capitalize">Room name: <span className="text-lg font-bold">{roomName}</span></p>
            <p className="text-xs text-gray-500">June 23, 2023</p>
         </div>
         <p>Room Id: <span className="text-sm bg-gray-300 px-4 py-1 rounded-lg text-gray-700 border border-gray-400">{roomId}</span></p>
         <div className="flex gap-5 ">
            <p>Status:</p>
            <div className="flex gap-2 items-center">
               <StatusCircle status={status} />
               <p className="lowercase text-sm text-gray-500">{status}</p>
            </div>
         </div>
      </div>
      <div>
         <p className="text-sm">Your score: <span className="font-bold text-lg">{score}</span></p>
         <p className="text-xs">Quiz by: <span className="capitalize text-xs font-semibold">{adminName}</span></p>
      </div>
   </div>
}
