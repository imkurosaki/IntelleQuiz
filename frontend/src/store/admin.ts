import { atom } from "recoil";

export interface AdminInfo {
   id: string,
   username: string,
   image: number
}

const adminInfo = atom<AdminInfo>({
   key: 'adminInfo',
   default: {
      id: "",
      username: "",
      image: 0
   },
})

export {
   adminInfo,
}
