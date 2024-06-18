import { atom } from "recoil";
import { Problem } from "../components/Room/Quizes";

export interface ParticipantInfo {
   id: string;
   roomId: string;
   status: string;
   image: string;
   problems: Problem[];
   success: boolean;
   error?: string | null
}

const participantInfo = atom({
   key: 'participantInfo',
   default: {}
})

const userJoinInfo = atom({
   key: 'userJoinInfo',
   default: {
      roomId: "",
      username: "",
   }
})

export {
   participantInfo,
   userJoinInfo
}
