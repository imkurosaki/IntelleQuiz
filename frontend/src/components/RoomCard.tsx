import { Socket } from "socket.io-client"
import { toast } from "sonner"
import { ErrorIcons } from "../pages/admin/Register"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function RoomCard({ name, roomId, status, socket }: {
   name: string,
   roomId: string,
   status: string,
   socket: Socket
}) {
   const navigate = useNavigate();

   useEffect(() => {
      // TODO: make the a leaderboard if the operation of the quiz is a leader board

   }, [])

   return <div onClick={() => {
      navigate(`${roomId}`)
   }} className="border relative border-gray-400 rounded-lg px-10 py-14 cursor-pointer shadow-lg hover:bg-gray-950 hover:text-white transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">
      <div>
         <p>Room: <span className="font-bold text-lg">{name}</span></p>
         <div className="flex items-center gap-3">
            <StatusCircle status={status} />
            <p className="lowercase text-sm text-gray-500">{status}</p>
         </div>
      </div>

      <button
         type="button"
         onClick={(e: any) => {
            e.stopPropagation();
            socket.emit("deleteRoom", ({ roomId }), ({ status, message }: {
               status: string,
               message: string
            }) => {
               if (status === "error") {
                  toast(message, {
                     className: "bg-gray-950 text-white",
                     duration: 5000,
                     icon: <ErrorIcons />
                  })
                  return;
               }
               toast.success(message, {
                  duration: 5000
               });
            })
         }}
      >
         <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="size-7 absolute top-5 right-5 shadow-lg transform active:scale-75 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
         </svg>
      </button>
   </div>
}


export const StatusCircle = ({ status }: {
   status: string
}) => {
   const getStatusColor = (status: string) => {
      switch (status) {
         case 'WAITING':
            return 'bg-green-500';
         case 'STARTED':
            return 'bg-red-500';
         case 'ONGOING':
            return 'bg-blue-500';
         default:
            return 'bg-gray-500';
      }
   };
   return <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
}
