import { useRecoilValue } from "recoil";
import Button from "../../components/Button";
import { useSocket } from "../../lib/hooks";
import { AdminInfo, adminInfo } from "../../store";
import { useNavigate } from "react-router-dom";


export default function QuizControl({ isReady }: {
   isReady: boolean
}) {
   const socket: Socket = useSocket();
   const adminInfoAtom = useRecoilValue<AdminInfo>(adminInfo);
   const navigate = useNavigate();

   const startAutomatically = () => {
      socket.emit("start-automatically", {
         roomId: adminInfoAtom.currentRoom.id
      });
      navigate("started");
   }

   const startManually = () => {
      console.log("asdasd")
      socket.emit("start", {
         roomId: adminInfoAtom.currentRoom.id
      });
      navigate("started");
   }

   return <div className="flex items-center flex-col">
      <p className="text-sm text-gray-600 mb-5">Quiz Control:</p>
      <div className="flex gap-3">
         <Button
            onClick={startAutomatically}
            className="py-3 px-4 text-white rounded-lg border-2 border-gray-200"
            disabled={isReady}
         >
            Start-automatically
         </Button>
         <Button
            onClick={startManually}
            className="py-3 px-6 text-white rounded-lg border-2 border-gray-200"
            disabled={isReady}
         >
            Start
         </Button>
      </div>
   </div >
}
