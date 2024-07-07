import { atom } from "recoil";
import { ParticipantProblem } from "../components/Room/Quizes";

export interface ParticipantInfo {
   id: string;
   roomId: string;
   status: string;
   image: string;
   problems: ParticipantProblem[];
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
