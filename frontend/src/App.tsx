import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Room from "./pages/Room"

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
   return <RouterProvider router={router} />
}

export default App
