
export default function FindRoomSkeleton() {
   return <div className="w-full flex flex-col gap-3">
      {[0, 1, 2, 3, 4].map((element: number) => {
         return <div key={element} className="w-full">
            <div className="animate-pulse p-6  w-full mx-auto border border-gray-300 shadow-lg rounded-xl bg-white">
               <div className="py-1">
                  <div className="grid grid-cols-12 gap-10">
                     <div className="h-4 bg-gray-300 rounded col-span-6"></div>
                     <div className="h-4 bg-gray-300 rounded col-start-12"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mt-2"></div>
               </div>
            </div>
         </div>
      })}
   </div>
}
