import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Room from "./pages/Room"
import { Toaster } from "sonner"
import Admin from "./pages/Admin"

const router = createBrowserRouter([
   {
      path: "/room",
      element: <Room />,
      children: [
         {
            path: "/room/:roomIdParams",
            element: <Room />
         },
      ]
   },
   {
      path: "/admin",
      element: <Admin />,
      children: [
         {
            path: "/admin/:roomIdParams",
            element: <Admin />
         },
      ]
   }
])

function App() {
   return <div>
      <RouterProvider router={router} />
      <Toaster />
   </div>
}

export default App
