export default function RoomCard({ name, status }: {
   name: string,
   status: string
}) {
   return <div className="border border-gray-400 rounded-lg px-10 py-14 cursor-pointer shadow-lg hover:bg-gray-950 hover:text-white">
      <div>
         <p>Room: {name}</p>
         <p>Status: {status}</p>
      </div>
   </div>
}
