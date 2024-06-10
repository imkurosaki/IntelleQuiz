

export default function Button({ label, onClick }: {
   label: string,
   onClick: any
}) {
   return <button
      onClick={onClick}
      className="w-full py-4 bg-gray-950 text-white rounded-full hover:bg-gray-900"
   >
      {label}
   </button>
}
