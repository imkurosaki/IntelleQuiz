import { atom } from "recoil";

export interface AdminInfo {
   username: string,
   currentRoom: string
}

const adminInfo = atom({
   key: 'adminInfo',
   default: {
      username: "",
      currentRoom: "",
   },
})

export {
   adminInfo,
}
