import { useState } from "react";
import { getImageUrl, removeCookie } from "../../lib";
import { useNavigate } from "react-router-dom";

export default function DropDownProfile({ image, username }: {
   image: string,
   username: string
}) {
   const [isOpen, setIsOpen] = useState(false);
   const navigate = useNavigate();

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
            className="w-12 rounded-full border border-gray-900 cursor-pointer"
         />
         <div
            className={`origin-top-right absolute right-0 px-5 py-4  w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition transform duration-200 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
               }`}
         >
            <p className="text-sm capitalize">Username: {username}</p>
            <div className="ps-16 mt-10">
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
