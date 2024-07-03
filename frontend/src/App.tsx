import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Room from "./pages/Room"
import { Toaster } from "sonner"
import Register from "./pages/user/Register"
import AddRoom from "./pages/user/AddRoom"
import AddProblem from "./pages/user/AddProblem"
import { RecoilRoot } from "recoil"
import Started from "./pages/user/Started"
import Signin from "./pages/user/Signin"
import FindRoom from "./components/Room/FindRoom"
import RoomLeaderboard from "./components/Room/RoomLeaderboard"
import AuthLayout from "./pages/AuthLayout"
import MainLayout from "./pages/MainLayout"

const router = createBrowserRouter([
   {
      path: "/",
      children: [
         {
            element: <AuthLayout />,
            children: [
               {
                  path: "register", // Change to "/register"
                  element: <Register />
               },
               {
                  path: "signin", // Change to "/register"
                  element: <Signin />
               },
            ]
         },
         {
            element: <MainLayout />,
            children: [
               {
                  path: "findRoom",
                  element: <FindRoom />
               },
               {
                  path: "findRoom/:roomIdParams",
                  element: <Room />
               },
               {
                  path: "findRoom/:quizId/leaderboard",
                  element: <RoomLeaderboard />
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
               },
               {
                  path: "room/:roomIdParams/leaderboard",
                  element: <RoomLeaderboard />
               },
            ]
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
