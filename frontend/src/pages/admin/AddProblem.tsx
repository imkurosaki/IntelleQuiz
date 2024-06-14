import { useParams } from "react-router-dom";

export default function AddProblem() {
   const { roomIdParams } = useParams();
   return <div>{JSON.stringify(roomIdParams)}</div>
}
