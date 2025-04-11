import { AppNavbar, SidebarApp } from "@/components/layouts";
import { AnimatedRoutes } from "@/libs/animated-routes";
import { AppWrapper } from "@/services/wrappers";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <AppWrapper>
      <div className='w-screen h-screen overflow-hidden bg-slate-100'>
        <div className='flex w-full h-min z-10'>
          <AppNavbar />
        </div>

        <div className='flex w-full h-full overflow-hidden'>
          <SidebarApp />

          <AnimatedRoutes>
            <div className='flex flex-col w-full h-full overflow-hidden'>
              <Outlet />
            </div>
          </AnimatedRoutes>
        </div>

        <Outlet />
      </div>
    </AppWrapper>
  );
};
