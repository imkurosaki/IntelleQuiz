

export default function Input({ placeholder, type, onChange }: {
   placeholder: string,
   type: string,
   onChange: any,
}) {
   return <div>
      <input
         type={type}
         placeholder={placeholder}
         onChange={onChange}
         className="py-3 px-4 border w-full border-gray-200 bg-gray-100 rounded-xl"
      />
   </div>
}
