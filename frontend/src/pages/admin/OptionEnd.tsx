import { Socket } from "socket.io-client";
import { removeCookie } from "../../lib";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function OptionEnd({ socket, roomId }: {
   socket: Socket,
   roomId: string
}) {
   const navigate = useNavigate();

   return <div className="flex gap-4 flex-col items-center mt-20">
      <p className="text-sm">The quiz is over, want to add more quiz?</p>
      <div className="flex gap-4">
         <button className="bg-gray-100 hover:bg-gray-50 border border-gray-900 px-8 py-3 text-black rounded-md"
            onClick={() => {
               socket.emit("leaveRoom", {
                  roomId
               });
               removeCookie('token');
               navigate("/signin")
            }}
         >
            Logout
         </button>
         <Button className="bg-gray-900 border border-gray-700 hover:bg-gray-800 px-8 py-3 text-white rounded-md"
            onClick={() => {
               socket.emit("leaveRoom", {
                  roomId
               })
               navigate("/room")
            }}
         >
            Yes, please
         </Button>
      </div>
   </div>
}
