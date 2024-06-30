import { Outlet } from 'react-router-dom';
import NavbarAuth from '../components/Navbar/NavbarAuth';

export default function AuthLayout() {
   return (
      <div>
         <NavbarAuth />
         <main>
            <Outlet />
         </main>
      </div>
   );
}
