import { useNavigate } from "react-router-dom";
import { ThemeContextInterface } from "../lib/types";
import { useContext } from "react";
import { ThemeContext } from "../contexts";
import ReactPlayer from 'react-player/youtube';
import SourceCode from "../components/SourceCode";

export default function Home() {
   const { darkTheme } = useContext(
      ThemeContext
   ) as ThemeContextInterface;
   const navigate = useNavigate();

   return <div className="pt-50 flex gap-20 items-center justify-between px-72 bg-bgColor h-screen">
      <div>
         <HomeTitle />
         <div className={`${darkTheme ? "text-gray-300" : "text-gray-900"}`}>
            <p className={`text-2xl mt-4 w-[530px]`}>Speed up your quiz journey with IntelleQuiz </p>
            <p className="text-xl mt-2">– knowledge in a flash.</p>
         </div>
         <button
            onClick={() => {
               navigate("/signin")
            }}
            className="flex gap-1 px-8 items-center py-4 mt-12 bg-violet-500 text-white text-lg rounded-full hover:bg-violet-700">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
         </button>
      </div>
      <div className="shadow-2xl border border-gray-500">
         <ReactPlayer
            url="https://youtu.be/PNCAbdxxUeM"
            width="800px"
            height="450px"
            controls
            playing={true}
         />
      </div>
      <SourceCode link={"https://github.com/imkurosaki/real-time-quiz"} />
   </div>
}

function HomeTitle() {
   const navigate = useNavigate();

   return <h1
      onClick={() => {
         navigate("/");
      }}
      className="text-7xl cursor-pointer font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      IntelleQuiz
   </h1>
}
