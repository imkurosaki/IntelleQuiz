import { useNavigate } from "react-router-dom";


export default function Title() {
   const navigate = useNavigate();
   return <div>
      <h1
         onClick={() => {
            navigate("/room");
         }}
         className="text-3xl cursor-pointer font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
         IntelleQuiz
      </h1>
   </div>
}
