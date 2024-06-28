import { z } from "zod";

export const joinInput = z.object({
   roomId: z.string().min(5, {
      message: "Room id is invalid"
   })
})
