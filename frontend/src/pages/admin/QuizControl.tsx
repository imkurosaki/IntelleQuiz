import Button from "../../components/Button";
import { useSocket } from "../../lib/hooks";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import Cookies from 'js-cookie';
import { ThemeContext } from "../../contexts";
import { ThemeContextInterface } from "../../lib/types";
import { useContext } from "react";

export default function QuizControl({ isReady, quizId, roomId }: {
   isReady: boolean,
   quizId: string,
   roomId: string
}) {
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");
   const navigate = useNavigate();
   const { darkTheme, toggleTheme } = useContext(
      ThemeContext
   ) as ThemeContextInterface;

   const startAutomatically = () => {
      socket.emit("start-automatically", {
         roomId,
         quizId
      });
      navigate("started");
   }

   const startManually = () => {
      socket.emit("start", {
         roomId,
         quizId
      });
      navigate("started");
   }

   return <div className="flex items-center flex-col">
      <p className="text-sm text-gray-600 mb-5">Quiz Control:</p>
      <div className="flex gap-3">
         <Button
            onClick={startAutomatically}
            className={`${darkTheme} py-3 px-4 text-white rounded-lg border-2 border-gray-200`}
            disabled={isReady}
         >
            Start-automatically
         </Button>
         <Button
            onClick={startManually}
            className={`${darkTheme && !isReady ? "bg-white text-gray-900 hover:bg-white" : ""} py-3 px-6 text-white rounded-lg border-2 border-gray-200`}
            disabled={isReady}
         >
            Start
         </Button>
      </div>
   </div >
}
