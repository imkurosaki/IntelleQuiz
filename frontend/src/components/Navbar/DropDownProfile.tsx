import { useContext, useState } from "react";
import { getImageUrl, removeCookie } from "../../lib";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts";
import { ThemeContextInterface } from "../../lib/types";

export default function DropDownProfile({ image, username }: {
   image: string,
   username: string
}) {
   const [isOpen, setIsOpen] = useState(false);
   const navigate = useNavigate();
   const { darkTheme, toggleTheme } = useContext(
      ThemeContext
   ) as ThemeContextInterface;

   const handleMouseEnter = () => {
      setIsOpen(true);
   };

   const handleMouseLeave = () => {
      setIsOpen(false);
   };

   return (
      <div
         className="relative inline-block text-left"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
      >
         <img
            src={getImageUrl(image)}
            alt=""
            className="w-12 rounded-full border border-gray-800 cursor-pointer"
         />
         <div
            className={`origin-top-right bg-bgColor absolute right-0 border border-gray-800  w-60 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition transform duration-200 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
               }`}
         >
            <div className={`${!darkTheme ? "hover:bg-gray-100 border-b-gray-400" : "hover:bg-gray-900 border-b-gray-800"} border-b cursor-pointer flex gap-3 items-center  py-4 px-4 `}>
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                  className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
               </svg>
               <div>

                  <p className="font-light text-sm">Signed is as</p>
                  <p className=" capitalize">{username}</p>
               </div>
            </div>
            <div
               onClick={toggleTheme}
               className={`${!darkTheme ? "hover:bg-gray-100 border-b-gray-400" : "hover:bg-gray-900 border-b-gray-800"} flex justify-between border-b cursor-pointer py-4 px-4 `}>
               <div className="flex gap-3 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                     className="size-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                  <p className="">Theme</p>
               </div>
               {darkTheme
                  ?
                  <svg
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                     className="size-8 fill-white">
                     <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
                  </svg>
                  :
                  <svg
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                     className="size-8 fill-black">
                     <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
                  </svg>
               }
            </div>
            <div className="px-2 py-4">
               <button className="bg-gray-50 hover:bg-gray-950 text-sm hover:text-white w-full border border-gray-300 py-3 text-black rounded-md"
                  onClick={() => {
                     removeCookie('token');
                     navigate("/signin")
                  }}
               >
                  Logout
               </button>
            </div>
         </div>
      </div>
   );
}
