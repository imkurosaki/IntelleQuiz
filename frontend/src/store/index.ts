import { atom } from "recoil";

export interface AdminInfo {
   username: string
}

const adminInfo = atom({
   key: 'adminInfo',
   default: {
      username: "",
   },
})

export {
   adminInfo,
}
