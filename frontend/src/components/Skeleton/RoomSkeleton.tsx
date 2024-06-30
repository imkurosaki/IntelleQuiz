

export default function RoomSkeleton() {
   return <div className="grid grid-cols-4 gap-6">
      {[0, 1, 2, 3, 4, 5, 6].map((element: number) => {
         return <div key={element} className="w-full">
            <div className="animate-pulse p-6 max-w-sm w-full mx-auto border border-gray-300 shadow-lg rounded-xl bg-white">
               <div className="flex justify-end">
                  <div className="bg-gray-300 h-10 w-8"></div>
               </div>
               <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="space-y-2">
                     <div className="h-4 bg-gray-300 rounded"></div>
                     <div className="h-4 bg-gray-300 rounded w-[100px]"></div>
                  </div>
               </div>
            </div>
         </div>
      })}
   </div>
}
