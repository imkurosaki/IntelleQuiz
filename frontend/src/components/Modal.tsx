
export default function Modal({ isOpen, setIsModalOpen }: {
   isOpen: boolean,
   setIsModalOpen: any
}) {
   if (!isOpen) {
      return <div></div>;
   }
   return (
      <div className="relative z-10" role="dialog" aria-modal="true">
         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
         <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
               <div className="relative  transform overflow-hidden py-12 pb-12 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                     <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                           <svg
                              onClick={setIsModalOpen}
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                              className="size-6 absolute right-4 top-4 cursor-pointer rounded-full">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                           </svg>
                           <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Problems Limit</h3>
                           <div className="mt-6">
                              <p className="text-sm text-gray-500">You've reach the last <span className="font-bold text-gray-900">problem</span>, do you want to add more quizes?</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
