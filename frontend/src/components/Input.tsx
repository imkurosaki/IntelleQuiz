export default function Input({ placeholder, type, onChange, value }: {
   placeholder: string,
   type: string,
   onChange: any,
   value?: string,
}) {
   return <div>
      <input
         type={type}
         placeholder={placeholder}
         onChange={onChange}
         value={value}
         className="py-3 bg-bgColor px-4 border w-full border-gray-700 rounded-xl"
      />
   </div>
}
