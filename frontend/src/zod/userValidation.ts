import { z } from "zod";

export const joinInput = z.object({
   roomId: z.string().min(5, {
      message: "Room id is invalid"
   }),
   username: z.string().min(3, {
      message: "Username must be 3 or more characters"
   }).max(10, {
      message: "Username must be 10 below characters"
   })
})
