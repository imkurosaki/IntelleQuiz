import { getImageUrl, randomColor, widthStyle } from "../../lib"
import { Participant } from "./WaitingPage"

export default function Leaderboard({ leaderboard }: {
   leaderboard: Participant[]
}) {

   return <div className="w-full flex justify-center">
      <div className="mt-16">
         <p className="text-5xl ps-28 mb-16">Leaderboard Results</p>
         <div className="flex flex-col gap-3">
            {leaderboard.map((element: any, key: number) => {
               return <PointsUserCard key={key} id={element.participant.id} username={element.participant.username} points={element.points} image={element.participant.image.toString()} />
            })}
         </div>
      </div>
   </div>
}

export function PointsUserCard({ id, username, points, image }:
   Participant
) {
   return <div className="bounce-left flex items-center gap-3">
      <p className="font-semibold text-lg w-[100px] text-end">{Math.round(points)}<span className="text-xs">p</span></p>
      <div className="flex items-center gap-4">
         <div className={`h-12 ${widthStyle(points)} ${randomColor()} flex items-center justify-end rounded-r-full`}>
            <img
               src={getImageUrl(image)}
               alt=""
               className="w-12 h-12 rounded-full border-2 border-white"
            />
         </div>
         <p className="capitalize">{username}</p>
      </div>
   </div >
}

