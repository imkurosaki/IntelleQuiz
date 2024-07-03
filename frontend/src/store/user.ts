import { atom } from "recoil";

export interface UserInfo {
   id: string,
   username: string,
   email: string,
   image: number
}

const userInfoAtom = atom<UserInfo>({
   key: 'userInfoAtom',
   default: {
      id: "",
      username: "",
      email: "",
      image: 0
   },
   effects_UNSTABLE: [
      ({ setSelf, onSet }) => {
         // Initialize state from localStorage if available
         const savedValue = localStorage.getItem('user-info');
         if (savedValue != null) {
            setSelf(JSON.parse(savedValue));
         }

         // Subscribe to state changes and update localStorage
         onSet((newValue) => {
            localStorage.setItem('user-info', JSON.stringify(newValue));
         });
      }
   ]
})

const currentRoomJoined = atom({
   key: "currentRoomJoined",
   default: {
      pointsId: "",
      quizId: "",
      roomId: ""
   },
   effects_UNSTABLE: [
      ({ setSelf, onSet }) => {
         // Initialize state from localStorage if available
         const savedValue = localStorage.getItem('currentRoomJoined');
         if (savedValue != null) {
            setSelf(JSON.parse(savedValue));
         }

         // Subscribe to state changes and update localStorage
         onSet((newValue) => {
            localStorage.setItem('currentRoomJoined', JSON.stringify(newValue));
         });
      },
   ],
})

export {
   userInfoAtom,
   currentRoomJoined
}
