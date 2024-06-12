const colors = [
   "bg-green-300",
   "bg-orange-300",
   "bg-amber-300",
   "bg-lime-300",
   "bg-cyan-300",
   "bg-blue-300",
   "bg-purple-300",
]
export const randomColor = () => {
   const randomNumber = Math.floor(Math.random() * 6) + 1;
   return colors[randomNumber];
}

export const getImageUrl = (index: string) => {
   return new URL(`../assets/avatar${index}.png`, import.meta.url).href;
}

export const widthStyle = (points: number) => {
   let pointsString = "";
   if (points >= 1000) pointsString = "w-[1000px]"
   else if (points >= 900) pointsString = "w-[900px]"
   else if (points >= 800) pointsString = "w-[800px]"
   else if (points >= 700) pointsString = "w-[700px]"
   else if (points >= 600) pointsString = "w-[600px]"
   else if (points >= 500) pointsString = "w-[500px]"
   else if (points >= 400) pointsString = "w-[400px]"
   else if (points >= 300) pointsString = "w-[300px]"
   else if (points >= 200) pointsString = "w-[200px]"
   else if (points >= 100) pointsString = "w-[100px]"
   else if (points >= 0) pointsString = "w-[50px]"

   return pointsString;
}
