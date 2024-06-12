

export default function Button({ label, onClick, disabled }: {
   label: string,
   onClick: any
   disabled?: boolean
}) {
   return <button
      onClick={onClick}
      className={`${!disabled ? "bg-gray-950 hover:bg-gray-900" : "bg-gray-300"} w-full py-4  text-white rounded-full `}
      disabled={disabled ?? false}
   >
      {label}
   </button>
}
