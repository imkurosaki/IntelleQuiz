
export default function LeaderBoardSkeleton() {
   return <div className="w-full h-screen">
      <div className="p-6 w-[800px] animate-pulse h-[750px] mx-auto">
         <div className="py-1">
            <div className="grid grid-cols-12 gap-10">
               <div className=" h-8 bg-gray-300 rounded-lg col-span-6"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded-full w-full mt-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mt-3"></div>
         </div>

         <div className="py-1 mt-3">
            <div className="h-9 bg-gray-300 rounded w-3/4 mt-3"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mt-3"></div>
            <div className="h-8 bg-gray-300 rounded w-full mt-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mt-3"></div>
         </div>

         <div className="py-1 mt-3">
            <div className="h-8 bg-gray-300 rounded w-full mt-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mt-3"></div>
            <div className="h-4 bg-gray-300 rounded w-full mt-3"></div>
            <div className="h-20 bg-gray-300 rounded w-full mt-3"></div>
         </div>
      </div>
   </div>
}
