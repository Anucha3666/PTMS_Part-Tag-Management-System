import { AppNavbar } from "@/components/layouts";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <div className='w-screen h-screen overflow-hidden bg-slate-100'>
      <AppNavbar />

      <Outlet />
    </div>
  );
};
