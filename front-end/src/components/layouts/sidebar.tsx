import { SRC_USER } from "@/constants";
import { cn } from "@/libs/cn";
import { setIsOpenSidebar } from "@/store/features/utils.features";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookText,
  Boxes,
  GitCompareArrows,
  LogOut,
  PrinterCheck,
  Settings,
  SquareChevronRight,
  Tags,
} from "lucide-react";
import { ReactElement, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOutModal } from "./log-out-modal";

export const SidebarApp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isOpenSidebar, dataUser } = useAppSelector((state) => state.utils);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleCollapsed = () => {
    dispatch(setIsOpenSidebar(!isOpenSidebar));
  };

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
  ];

  return (
    <>
      <motion.div
        animate={{ width: isOpenSidebar ? 260 : 58 }}
        className=' bg-white  z-10 hidden pb-[60px]  h-full shadow-lg  md:flex flex-col overflow-hidden border-r-[1px]'>
        <div
          className={cn(
            "flex items-center w-full h-min overflow-hidden px-2 py-2 border-b-[1px] border-gray-200  ",
            isOpenSidebar ? "justify-between" : "justify-end"
          )}>
          <div className=' flex overflow-hidden w-full'>
            <AnimatePresence>
              {isOpenSidebar && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.8, type: "spring" }}>
                  <div className='gap-1 w-full h-[2rem] overflow-hidden justify-center items-center hidden md:flex  '>
                    <img
                      src={dataUser?.profile_picture ?? ""}
                      alt='profile'
                      width='34'
                      height='34'
                      className='!max-w-[34px] !max-h-[34px] w-[34px] h-[34px] object-cover rounded-full border-[1px] my-4 shadow-md'
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SRC_USER;
                      }}
                    />

                    <div className='flex w-full flex-col text-sm'>
                      <p className='font-medium whitespace-nowrap text-ellipsis overflow-hidden w-[120px]'>
                        {(dataUser?.first_name ?? "") === ""
                          ? "Anonymous"
                          : `${dataUser?.first_name} ${dataUser?.last_name}`}
                      </p>
                      <div className='flex w-full gap-1 text-[0.8rem]'>
                        <p className='font-medium whitespace-nowrap text-ellipsis overflow-hidden w-[120px]'>
                          {dataUser?.position ?? "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={toggleCollapsed}
            className='p-2 bg-gray-100 w-min  rounded-md'>
            <motion.div
              animate={{
                rotate: isOpenSidebar ? 180 : 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                type: "spring",
              }}>
              <SquareChevronRight size={24} />
            </motion.div>
          </button>
        </div>

        <div className='h-full flex flex-col justify-between overflow-hidden'>
          <div>
            {dataMenu?.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "cursor-pointer py-2",
                  item?.page ?? "" !== ""
                    ? location?.pathname === item?.page
                      ? "bg-gray-200  text-blue-700 "
                      : "hover:bg-gray-200  hover:text-blue-500 "
                    : item?.children
                        ?.map(({ page }) => page)
                        ?.includes(location?.pathname)
                    ? "bg-gray-100 text-blue-700  "
                    : "hover:bg-gray-100 ",
                  item?.hidden ? " hidden" : ""
                )}
                onClick={() => {
                  if (item?.page) navigate(item?.page);
                }}>
                <div className='flex items-center gap-2 px-4'>
                  {item.icon}
                  {isOpenSidebar && (
                    <span className=' font-bold text-nowrap'>{item.label}</span>
                  )}
                </div>

                {item?.children && (
                  <div
                    className={cn(
                      "mt-2 space-y-0 flex flex-col gap-1",
                      isOpenSidebar ? "ml-2 px-4" : " px-2"
                    )}>
                    {item?.children.map((child, i) => (
                      <div
                        key={i}
                        className={cn(
                          "text-sm flex items-center gap-2 py-1 px-2 rounded-md",
                          location?.pathname === child?.page
                            ? "bg-gray-200   text-blue-700 "
                            : "hover:bg-gray-200 text-black   hover:text-blue-500 ",
                          child?.hidden ? " hidden" : ""
                        )}
                        onClick={() => {
                          if (child?.page) navigate(child?.page);
                        }}>
                        {child.icon}
                        {isOpenSidebar && (
                          <p className=' font-medium text-nowrap'>
                            {child.label}
                          </p>
                        )}
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
                  ? "bg-gray-200   text-blue-700 "
                  : "hover:bg-gray-200  hover:text-blue-500 "
              )}
              onClick={() => navigate("/settings")}>
              <Settings />
              {isOpenSidebar && (
                <span className=' text-[1rem] font-bold'>Settings</span>
              )}
            </div>
            <div className='px-4 py-2 border-t-[1px] border-gray-200   hover:bg-gray-200  hover:text-red-500 cursor-pointer'>
              <div
                className='flex items-center gap-2'
                onClick={() => setIsOpen(true)}>
                <LogOut />
                {isOpenSidebar && <span className=' font-bold'>Log out</span>}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <LogOutModal {...{ isOpen, setIsOpen }} />
    </>
  );
};
