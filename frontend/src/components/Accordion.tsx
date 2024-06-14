import { useEffect, useRef, useState } from "react";


export default function Accordion({ title, roomId }: {
   title: string,
   roomId?: string,
}) {
   const [isOpen, setIsOpen] = useState(false);
   const contentRef: any = useRef(null);

   const handleToggle = () => {
      setIsOpen(!isOpen);
   };

   return (
      <div className="border-b">
         <button
            className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
            onClick={handleToggle}
         >
            <span className="text-sm text-gray-500">{title}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
               <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
               </svg>
            </span>
         </button>
         <div
            ref={contentRef}
            className={`transition-all duration-300  ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
            style={{ maxHeight: isOpen ? `${contentRef.current.scrollHeight}px` : '0' }}
         >
            <div className="p-4">
               <CopyClipboard clipboard={roomId} />
            </div>
         </div>
      </div>
   );
}

export function CopyClipboard({ clipboard }: {
   clipboard?: string
}) {
   const [showAlert, setShowAlert] = useState(false)
   const handleCopyClick = () => {
      setShowAlert(true)
      navigator.clipboard.writeText(clipboard || "null")
      setTimeout(() => {
         setShowAlert(false)
      }, 2000)
   }

   return (
      <div className="relative flex items-center justify-between text-gray-500 border border-gray-500 bg-gray-200 ps-8 pe-4 py-2 rounded-md">
         <span className="font-mono text-sm">{clipboard || "No room id generated"}</span>
         <button onClick={handleCopyClick}>
            <CopyIcon className="h-5 w-5" />
         </button>
         {showAlert && (
            <div className="absolute text-xs bottom-[-5px] right-0 transform translate-y-full bg-gray-900 text-white px-2 py-2 rounded-md shadow-lg">
               Copied
            </div>
         )}
      </div>
   )
}

export function CopyIcon({ className }: {
   className: string
}) {
   return (
      <svg
         className={className}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
         <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
   )
}
