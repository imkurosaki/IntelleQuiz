

export default function Input({ label, type, onChange }: {
   label: string,
   type: string,
   onChange: any,
}) {
   return <div>
      <p>{label}</p>
      <input type={type} onChange={onChange} />
   </div>
}
