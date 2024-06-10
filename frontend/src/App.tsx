import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Room from "./pages/Room"
import { Toaster } from "sonner"

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
   }
])

function App() {
   return <div>
      <RouterProvider router={router} />
      <Toaster />
   </div>
}

export default App
