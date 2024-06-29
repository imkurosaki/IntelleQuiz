import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
   return (
      <div>
         <main>
            <Outlet />
         </main>
      </div>
   );
}
