import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useRef } from "react";
import { adminInfo } from "../../store/admin";
import DropDownProfile from "./DropDownProfile";

export default function Navbar() {
   const navigate = useNavigate();
   const adminInfoState = useRecoilValue(adminInfo);
   const flagRoom = useRef<boolean>(false);

   return <div className="flex sticky top-0 bg-white shadow-md z-50 justify-between items-center px-20 py-3 border border-gray-700">
      <p>Title</p>
      <div className="flex gap-10">
         {flagRoom.current === false
            ?
            <button className="bg-gray-100 hover:bg-gray-950 hover:text-white border border-gray-900 px-8 py-3 text-black rounded-md shadow-lg transform active:scale-75 transition-transform"
               onClick={() => {
                  flagRoom.current = true;
                  navigate("/findRoom")
               }}
            >
               Find Room
            </button>
            :
            <button className="bg-gray-100 hover:bg-gray-950 hover:text-white border border-gray-900 px-8 py-3 text-black rounded-md shadow-lg transform active:scale-75 transition-transform"
               onClick={() => {
                  flagRoom.current = false;
                  navigate("/room")
               }}
            >
               Add Room
            </button>
         }
         <DropDownProfile image={adminInfoState.image.toString()} username={adminInfoState.username} />
      </div>
   </div>
}
