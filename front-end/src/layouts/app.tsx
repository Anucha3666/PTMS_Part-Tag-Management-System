import { AppNavbar } from "@/components/layouts";
import { AppWrapper } from "@/services/wrappers";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <AppWrapper>
      <div className='w-screen h-screen overflow-hidden bg-slate-100'>
        <AppNavbar />

        <Outlet />
      </div>
    </AppWrapper>
  );
};
