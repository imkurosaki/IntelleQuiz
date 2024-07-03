import { z } from "zod";

export const adminAddRoomInput = z.object({
   roomName: z.string().min(3, {
      message: "Room must be 4 or more characters"
   }).max(20, {
      message: "Room must be 20 below characters"
   })
}) 
