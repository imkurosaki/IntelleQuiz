import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Room from "./pages/Room"
import { Toaster } from "sonner"
import Register from "./pages/admin/Register"
import AddRoom from "./pages/admin/AddRoom"
import AddProblem from "./pages/admin/AddProblem"
import { RecoilRoot } from "recoil"
import Started from "./pages/admin/Started"
import Signin from "./pages/admin/Signin"

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
            path: "signin", // Change to "/register"
            element: <Signin />
         },
         {
            path: "room",
            element: <AddRoom />
         },
         {
            path: "room/:roomIdParams",
            element: <AddProblem />
         },
         {
            path: "room/:roomIdParams/started",
            element: <Started />
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
