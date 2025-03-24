import { AppNavbar, SidebarApp } from "@/components/layouts";
import { AnimatedRoutes } from "@/libs/animated-routes";
import { AppWrapper } from "@/services/wrappers";
import { Breadcrumb } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pages = location?.pathname?.split("/")?.filter((page) => page !== "");

  return (
    <AppWrapper>
      <div className='w-screen h-screen overflow-hidden bg-slate-100'>
        <AppNavbar />

        <div className='flex w-full h-full overflow-hidden'>
          <SidebarApp />
          <AnimatedRoutes>
            <div className='flex flex-col w-full h-full overflow-hidden'>
              <div className='w-full sticky top-0 z-30 pt-2 px-2 bg-[#F1F1F1] dark:bg-[#081028]'>
                <Breadcrumb
                  className='pb-1 pl-1 text-[1rem] font-medium'
                  items={pages?.map((page, i) => ({
                    title:
                      page?.split("-")?.join(" ")?.slice(0, 1)?.toUpperCase() +
                      page?.split("-")?.join(" ")?.slice(1),
                    onClick: () => {
                      navigate(`/${pages?.slice(0, i + 1)?.join("/")}`);
                    },
                    className:
                      "cursor-pointer hover:text-black dark:hover:text-white",
                  }))}
                />
              </div>

              <Outlet />
            </div>
          </AnimatedRoutes>
        </div>

        <Outlet />
      </div>
    </AppWrapper>
  );
};
