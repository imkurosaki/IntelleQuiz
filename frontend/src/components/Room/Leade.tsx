
// import { useState } from "react";
// import { getImageUrl, randomColor } from "../../lib"
// import { Participant } from "./WaitingPage"
//
// export default function LeaderBoard({ leaderboard }: {
//    leaderboard: Participant[]
// }) {
//    return <div className="w-[1000px]">
//       <p className="font-semibold text-2xl">LEADERBOARD</p>
//       <div className="flex flex-col gap-3">
//          <PointsUserCard id="600" username="dsads" points={800} image="1" />
//          <PointsUserCard id="600" username="dsads" points={780} image="1" />
//          <PointsUserCard id="600" username="dsads" points={700} image="1" />
//          <PointsUserCard id="600" username="dsads" points={200} image="1" />
//       </div>
//    </div>
// }
//

// export function PointsUserCard({ id, username, points, image }: Participant) { const [pointsString, setPoinstString] = useState(`w-[${JSON.stringify(points)}px]`);
//
//    return <div className="flex w-full items-center gap-3">
//       <p className="font-semibold text-lg">{points}<span className="text-xs">p</span></p>
//       <div className="flex items-center gap-4">
//          <div className={`h-12 ${pointsString} ${randomColor()} flex items-center justify-end rounded-r-full`}>
//             <img
//                src={getImageUrl(image)}
//                alt=""
//                className="w-12 h-12 rounded-full border-2 border-white"
//             />
//          </div>
//          <p className="capitalize">{username}</p>
//       </div>
//    </div>
// }
