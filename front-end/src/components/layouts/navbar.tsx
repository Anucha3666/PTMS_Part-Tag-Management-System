import { useScreen } from "@/hooks";
import { cn } from "@/libs/cn";
import { useAppSelector } from "@/store/hook";
import { Button, Drawer } from "antd";
import {
  BookText,
  Boxes,
  Expand,
  GitCompareArrows,
  LogOut,
  Menu,
  PrinterCheck,
  Settings,
  Shrink,
  Tags,
} from "lucide-react";
import { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOutModal } from "./log-out-modal";

export const AppNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { dataUser } = useAppSelector((state) => state.utils);
  const { isFullScreen, toggleScreen } = useScreen();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const dataMenu: {
    label: string;
    icon: ReactElement;
    page?: string;
    hidden?: boolean;
    children?: {
      label: string;
      page?: string;
      icon: ReactElement;
      hidden?: boolean;
    }[];
  }[] = [
    {
      label: "Parts",
      page: "/parts",
      icon: <Boxes />,
    },
    {
      label: "Compare",
      page: "/compare",
      icon: <GitCompareArrows />,
      role: ["user", "admin", "owner"],
    },
    {
      label: "Reports",
      icon: <BookText />,
      children: [
        {
          label: "Printed",
          page: "/reports/printed",
          icon: <PrinterCheck size={22} />,
        },
        {
          label: "Tags",
          page: "/reports/tags",
          icon: <Tags size={22} />,
        },
      ],
    },
  ]?.filter(({ role }) =>
    role === undefined ? true : role?.includes(dataUser?.role ?? "")
  );

  return (
    <>
      <div className=' w-full h-min flex justify-between bg-white  gap-1 p-2 items-center shadow-md z-20'>
        <div className=' flex gap-2 w-full items-center'>
          <img
            src={
              "https://sncservices.sncformer.com/data/microservices/v1/file-storage/ptms/images/1a13374c-ff79-45a6-a122-e0ed6ef75c82-1745199350855.png"
            }
            alt='icon-ptms'
            className=' w-[2.4rem] h-[2.4rem]'
          />
          <div className='!w-[3px] h-[34px] rounded-full  bg-black  shadow-inner' />
          <div className=' text-sm'>
            <p
              className='text-xl font-bold'
              style={{ fontFamily: "Oswald, sans-serif" }}>
              PTMS
            </p>
            <p className=' -mt-2 text-[0.7rem] font-bold'>
              Part Tag Management System
            </p>
          </div>
        </div>

        <div className=' hidden md:flex w-min md:w-full justify-end gap-2  items-center'>
          <Button className='p-1' onClick={() => toggleScreen()}>
            {isFullScreen ? <Shrink /> : <Expand />}
          </Button>
        </div>

        <div className='flex md:hidden w-min md:w-full justify-end gap-2  items-center'>
          <Button className='p-1' onClick={() => setIsOpenMenu(true)}>
            <Menu />
          </Button>
        </div>
      </div>

      <Drawer
        title='Menu'
        width={"100%"}
        open={isOpenMenu}
        onClose={() => setIsOpenMenu(false)}>
        <div className='h-full flex flex-col justify-between overflow-hidden'>
          <div>
            {dataMenu?.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "cursor-pointer py-2",
                  item?.page ?? "" !== ""
                    ? location?.pathname === item?.page
                      ? "bg-gray-200   text-blue-700"
                      : "hover:bg-gray-200 hover:text-blue-500"
                    : item?.children
                        ?.map(({ page }) => page)
                        ?.includes(location?.pathname)
                    ? "bg-gray-100 text-blue-700"
                    : "hover:bg-gray-100",
                  item?.hidden ? " hidden" : ""
                )}
                onClick={() => {
                  setIsOpenMenu(false);
                  if (item?.page) navigate(item?.page);
                }}>
                <div className='flex items-center gap-2 px-4'>
                  {item.icon}
                  <span className=' font-bold text-nowrap'>{item.label}</span>
                </div>

                {item?.children && (
                  <div
                    className={cn(
                      "mt-2 space-y-0 flex flex-col gap-1",
                      "ml-2 px-4"
                    )}>
                    {item?.children.map((child, i) => (
                      <div
                        key={i}
                        className={cn(
                          "text-sm flex items-center gap-2 py-1 px-2 rounded-md",
                          location?.pathname === child?.page
                            ? "bg-gray-200 text-blue-700 "
                            : "hover:bg-gray-200 text-black hover:text-blue-500 ",
                          child?.hidden ? " hidden" : ""
                        )}
                        onClick={() => {
                          if (child?.page) navigate(child?.page);
                        }}>
                        {child.icon}

                        <p className=' font-medium text-nowrap'>
                          {child.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
            <div
              className={cn(
                "text-sm flex items-center gap-2 px-4 py-2",
                location?.pathname?.split("/")[1] === "settings"
                  ? "bg-gray-200 text-blue-700 "
                  : "hover:bg-gray-200 hover:text-blue-500 "
              )}
              onClick={() => {
                setIsOpenMenu(false);
                navigate("/settings");
              }}>
              <Settings />

              <span className=' text-[1rem] font-bold'>Settings</span>
            </div>
            <div className='px-4 py-2 border-t-[1px] border-gray-200  hover:bg-gray-200 hover:text-red-500 cursor-pointer'>
              <div
                className='flex items-center gap-2'
                onClick={() => setIsOpen(true)}>
                <LogOut />
                <span className=' font-bold'>Log out</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <LogOutModal {...{ isOpen, setIsOpen }} />
    </>
  );
};
