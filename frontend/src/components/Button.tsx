

export default function Button({ label, onClick }: {
   label: string,
   onClick: any
}) {
   return <button onClick={onClick}>
      {label}
   </button>
}
