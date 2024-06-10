export type Participant = {
   id: string;
   username: string;
   points: number;
   image: string
}

export default function WaitingPage({ participants, user }: {
   user: Participant,
   participants: Participant[]
}) {
   const getImageUrl = (index: string) => {
      return new URL(`../../assets/avatar${index}.png`, import.meta.url).href;
   }

   return <div className="flex justify-center pt-20 pb-10">
      <div className="w-[600px]">
         <div className="text-center">
            <div className="flex items-center justify-center">
               <img src={getImageUrl(user.image)} alt="" className="w-25 rounded-full" />
            </div>
            <div className="mt-6">
               <p className="text-lg font-medium">Get Ready to play <span className="font-semibold">{user.username}</span></p>
               <p className="text-xs font-light">answer fast to get more points</p>
            </div>
         </div>
         <p className="mt-12 text-sm">Waiting for others...</p>
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

export function UserCard({ id, username, points, image }: Participant) {
   return <div className="flex w-full justify-between items-center border border-gray-300 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer shadow-md">
      <div className="flex gap-4 items-center">
         <img src={image} alt=""
            className="w-10 rounded-full border border-gray-700"
         />
         <p className="text-sm">{username}</p>
      </div>
      <p className="text-sm">{points} points</p>
   </div>
}

