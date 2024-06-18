import { atom } from "recoil";

export interface AdminInfo {
   username: string,
   currentRoom: {
      id: string,
      noOfProblems: number
   }
}

const adminInfo = atom({
   key: 'adminInfo',
   default: {
      username: "",
      currentRoom: {
         id: "",
         noOfProblems: 0,
      },
   },
})

export {
   adminInfo,
}
