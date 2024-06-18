import { z } from "zod";

export const adminRegisterInput = z.object({
   username: z.string().min(3, {
      message: "Username must be 3 or more characters"
   }).max(10, {
      message: "Username must be 10 below characters"
   })
})

export const adminAddRoomInput = z.object({
   roomName: z.string().min(3, {
      message: "Room must be 4 or more characters"
   }).max(10, {
      message: "Room must be 20 below characters"
   })
}) 
