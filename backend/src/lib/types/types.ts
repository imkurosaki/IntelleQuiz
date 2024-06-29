

export interface Leaderboard {
   points: number,
   participant: {
      id: string,
      username: string,
      image: number
   }
}

export interface RegisterResponse {
   status: string,
   message: string
}

export interface Problem {
   roomId: string;
   id: string;
   title: string;
   options: string[];
   answer: number;
   countdown: number;
}

export interface User {
   id: string;
   username: string;
}
