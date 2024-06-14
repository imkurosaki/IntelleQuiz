import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Room from "./pages/Room"
import { Toaster } from "sonner"
import Register from "./pages/admin/Register"
import AddRoom from "./pages/admin/AddRoom"
import AddProblem from "./pages/admin/AddProblem"
import { RecoilRoot } from "recoil"

const router = createBrowserRouter([
   {
      path: "/room",
      element: <Room />,
      children: [
         {
            path: ":roomIdParams",
            element: <Room />
         }
      ]
   },
   {
      path: "/admin",
      children: [
         {
            path: "register", // Change to "/register"
            element: <Register />
         },
         {
            path: "room",
            element: <AddRoom />
         },
         {
            path: "room/:roomIdParams",
            element: <AddProblem />
         }
      ]
   }
])

function App() {
   return (
      <RecoilRoot>
         <RouterProvider router={router} />
         <Toaster />
      </RecoilRoot>
   )
}

export default App
