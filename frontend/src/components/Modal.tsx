import Button from "./Button";

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
               <div className="relative  transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                     <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                           <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Problems Limit</h3>
                           <div className="mt-6">
                              <p className="text-sm text-gray-500">You've reach the last question, do you want to add more problems?</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-8">
                     <Button
                        onClick={() => { }}
                        className="inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-sm hover:bg-gray-800 sm:ml-3 sm:w-auto"
                     >
                        Yes, please
                     </Button>
                     <Button
                        onClick={setIsModalOpen}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:mt-0 sm:w-auto"
                     >
                        No, that's all
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
