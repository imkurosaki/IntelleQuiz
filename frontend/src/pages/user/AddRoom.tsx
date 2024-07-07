import Input from "../../components/Input.tsx";
import Button from "../../components/Button.tsx";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ErrorIcons } from "./Register.tsx";
import { useSocket } from "../../lib/hooks.ts";
import { Socket } from "socket.io-client";
import { adminAddRoomInput } from "../../zod/adminValidation.ts";
import Cookies from 'js-cookie'
import RoomCard from "../../components/RoomCard.tsx";
import RoomSkeleton from "../../components/Skeleton/RoomSkeleton.tsx";
import { ThemeContextInterface } from "../../lib/types.ts";
import { ThemeContext } from "../../contexts/ThemeContext.tsx";
import axios from "axios";
import { getCookie } from "../../lib/index.ts";
import { userInfoAtom } from "../../store/user.ts";
import { useSetRecoilState } from "recoil";

export default function AddRoom() {
   const [, setDisable] = useState(true);
   const [roomName, setRoomName] = useState("");
   const navigate = useNavigate();
   const socket: Socket = useSocket(Cookies.get('token') || "Bearer ");
   const [error, setError] = useState("");
   const [rooms, setRooms]: any = useState([]);
   const [loading, setLoading] = useState(true);
   const { darkTheme } = useContext(
      ThemeContext
   ) as ThemeContextInterface;
   const setUserInfoState = useSetRecoilState(userInfoAtom);
   const apiUrl = import.meta.env.VITE_API_BASE_URL;

   const submitHandler = () => {
      const validation: any = adminAddRoomInput.safeParse({ roomName });
      if (!validation.success) {
         const errors: any = JSON.parse(validation.error.message);
         setError(errors[0].message);

         setTimeout(() => {
            setError("")
         }, 3000)
         return;
      }

      setDisable(false);

      socket.emit("addRoom", { roomName }, ({ status, message }: {
         status: string,
         message: string
      }) => {
         if (status === "error") {
            toast(message, {
               className: "bg-gray-950 text-white",
               duration: 5000,
               icon: <ErrorIcons />
            });
         }
      })
      setRoomName("");
   }

   useEffect(() => {
      // check if there is a cookie
      if (!Cookies.get('token')) {
         navigate('/signin')
      }

      socket.on("error", ({ message }: { message: string }) => {
         toast(message, {
            className: "bg-gray-950 text-white",
            duration: 5000,
            icon: <ErrorIcons />
         })
      });

      socket.on("getMyRooms", (rooms: {
         id: string,
         name: string,
         status: string,
         createdAt: Date,
         quizes: any
      }[]) => {
         setRooms(rooms);
      });

      socket.on("room", ({ message }: {
         message: string,
      }) => {
         toast.success(message, {
            duration: 5000
         });
      })

      socket.emit("getMyRooms", {}, async (rooms: {
         id: string,
         name: string,
         status: string,
         createdAt: Date,
         quizes: any
      }[]) => {
         setRooms(rooms);
         setLoading(false);
      })

      const fetchData = async () => {
         const token = getCookie('token');
         if (!token) {
            return;
         }

         try {
            const response = await axios.get(`${apiUrl}/getCurrentUser`, {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token
               }
            })

            setUserInfoState(response.data);
         } catch (error: any) {
            toast(error.response.data.message, {
               className: "bg-gray-950 text-white",
               duration: 5000,
               icon: <ErrorIcons />
            })
         }
      };
      fetchData();

      return () => {
         socket.off("error");
         socket.off("room");
         socket.off("getRoom")
         socket.off("getMyRooms")
      };
   }, [socket, navigate, apiUrl, setUserInfoState]);

   return <div className="px-20 pb-16 pt-28">
      <div className="w-[500px]">
         <div className="border border-gray-700 shadow-md px-10 py-14 rounded-lg">
            <div>
               <p className="mb-4">Add Room</p>
               <div className={`${error !== "" ? "block vibrate" : "hidden"} border border-gray-400 rounded-lg text-center py-3 px-2 my-4 bg-red-700 text-sm text-white w-full shadow-lg`}>{error}</div>
               <Input
                  type="text"
                  placeholder="Enter room name"
                  value={roomName || ""}
                  onChange={(e: any) => {
                     setRoomName(e.target.value);
                  }}
               />
            </div>
            {/* <Accordion title="Room Id" roomId={roomId} /> */}
            <div className="flex justify-end mt-8 gap-4">
               <Button
                  onClick={submitHandler}
                  className={`${darkTheme ? "bg-white hover:bg-white text-black" : "bg-blue-600 hover:bg-blue-700 text-white"} py-2 px-4 rounded-lg border border-gray-700`}
               >
                  Add
               </Button>
            </div>
         </div>
      </div>
      <div className="mt-8">
         <p className="mb-6">Your Rooms:</p>
         {loading ? (
            <RoomSkeleton />
         ) : (
            <div className="grid grid-cols-4 gap-6">
               {!rooms.length ?
                  <p className={`${darkTheme ? "bg-white hover:bg-white text-black" : ""} bg-gray-200 border border-gray-700 px-10 py-5 rounded-lg text-sm`}>No created room, please create one.</p>
                  : (
                     rooms.map((room: any, key: number) => {
                        return <div key={key}>
                           <RoomCard name={room.name} roomId={room.id} status={room.status} socket={socket} />
                        </div>
                     })
                  )}
            </div>
         )}
      </div>
   </div>
}


