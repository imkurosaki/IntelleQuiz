import { z } from "zod";

export const registerInput = z.object({
   email: z.string().email({
      message: "Invalid email, please input correct email"
   }),
   username: z.string().min(3, {
      message: "Username must be 3 or more characters"
   }).max(10, {
      message: "Username must be 10 below characters"
   }),
   password: z.string().min(3, {
      message: "Password must be 5 or more characters"
   }).max(12, {
      message: "Username must be 12 below characters"
   })
});

export const signinInput = z.object({
   email: z.string().email({
      message: "Invalid email, please input correct email"
   }),
   password: z.string().min(3, {
      message: "Password must be 5 or more characters"
   }).max(12, {
      message: "Username must be 12 below characters"
   })
});

export const adminAddRoomInput = z.object({
   roomName: z.string().min(3, {
      message: "Room must be 4 or more characters"
   }).max(20, {
      message: "Room must be 20 below characters"
   })
}) 
