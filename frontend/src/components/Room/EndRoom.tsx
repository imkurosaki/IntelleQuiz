import { useNavigate } from "react-router-dom"
import { PointsUserCard } from "./Leaderboard"
import { Participant } from "./WaitingPage"
import { Socket } from "socket.io-client"

export default function EndRoom({ leaderboard, socket, roomId }: {
   socket: Socket,
   leaderboard: Participant[],
   roomId: string,
}) {
   const navigate = useNavigate();

   return <div className="flex justify-center pt-16">
      <div>
         <div className="ps-28">
            <p className="text-sm text-gray-500">The quiz is ended</p>
            <p className="text-5xl mb-12">Leaderboard Results</p>
         </div>
         <div className="flex flex-col gap-3">
            {leaderboard.map((participant: Participant, key: number) => {
               return <div key={key} className="flex items-center">
                  <PointsUserCard key={key} id={participant.id} username={participant.username} points={participant.points} image={participant.image} />
                  {key === 0 ?
                     <img src={new URL(`../../assets/gold-medal.png`, import.meta.url).href} alt=""
                        className="w-12 ms-2 shake-left-right"
                     />
                     : <p></p>}
               </div>
            })}
         </div>
         <div className="flex justify-end mt-20">
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
   </div>
}
