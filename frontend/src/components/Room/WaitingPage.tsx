import { getImageUrl } from "../../lib";

export type Participant = {
   id: string;
   username: string;
   points: number;
   image: string
}

export default function WaitingPage({ participants, user, noOfProblems }: {
   user: Participant,
   participants: Participant[],
   noOfProblems: number,
}) {

   return <div className="flex justify-center pt-20 pb-36">
      <div className="w-[650px]">
         <div className="text-center">
            <div className="flex flex-col gap-4 items-center justify-center">
               <img src={getImageUrl(user.image)} alt="" className="w-25 rounded-full" />
               <p className="font-light text-xs">Question 1 of {noOfProblems}</p>
            </div>
            <div className="mt-6">
               <p className="text-lg font-medium">Get Ready to play <span className="capitalize font-semibold">{user.username}</span></p>
               <p className="text-xs font-light">answer fast to get more points</p>
            </div>
         </div>
         <p className="mt-12 ">Waiting for others...</p>
         <div className="flex flex-col gap-3 mt-8">
            {participants.map((participant: Participant) => {
               const avatarRef = getImageUrl(participant.image);
               return <UserCard key={participant.id}
                  id={participant.id}
                  username={participant.username}
                  points={participant.points}
                  image={avatarRef}
               />;
            })}
         </div>
      </div>
   </div>
}

export function UserCard({ username, points, image }: Participant) {
   return <div className="bounce-left text-gray-950 flex w-full justify-between items-center border border-gray-300 px-8 py-4 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer shadow-md">
      <div className="flex gap-8 items-center">
         <img src={image} alt=""
            className="w-16 rounded-full border border-gray-700"
         />
         <p className="capitalize text-lg">{username}</p>
      </div>
      <p className="text-2xl font-bold">{points}</p>
   </div>
}

