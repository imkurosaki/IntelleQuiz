import { ReactNode } from "react"


export default function Button({ children, onClick, className, disabled }: {
   children: ReactNode,
   onClick: any,
   className?: string,
   disabled?: boolean
}) {
   return <button
      onClick={onClick}
      disabled={disabled ?? false}
      className={`${!disabled ? "bg-gray-950 hover:bg-gray-900" : "bg-gray-300"} ${className}`}
   >
      {children}
   </button>
}
