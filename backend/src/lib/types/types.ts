

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
