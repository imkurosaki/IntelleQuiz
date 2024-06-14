import { atom } from "recoil";

export interface ParticipantInfo {
   id: string;
   roomId: string;
   status: string;
   problems: string[];
   success: boolean;
   error?: string | null
}

const participantInfo = atom({
   key: 'participantInfo',
   default: {}
})

export {
   participantInfo,
}
