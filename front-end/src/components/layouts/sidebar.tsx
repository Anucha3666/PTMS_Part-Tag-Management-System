import { cn } from "@/libs/cn";
import { setIsOpenSidebar } from "@/store/features/utils.features";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookText,
  ChartGantt,
  CircleUserRound,
  FileCog,
  FileTerminal,
  FileText,
  Grid3x3,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Monitor,
  PackageCheck,
  Settings,
  SquareChevronRight,
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
      label: "Monitor",
      icon: <Monitor />,
      children: [
        {
          label: "Work Card",
          page: "/monitor/work-card",
          icon: <LayoutGrid size={22} />,
        },
        {
          label: "Layout",
          page: "/monitor/layout",
          icon: <LayoutDashboard size={22} />,
        },
      ],
    },
    {
      label: "Planning",
      page: "/planning",
      icon: <ChartGantt />,
    },
    {
      label: "Work schedule",
      page: "/work-schedule",
      icon: <Grid3x3 />,
    },
    {
      label: "Report",
      icon: <BookText />,
      children: [
        {
          label: "Daily",
          page: "/report/daily",
          icon: <FileText size={22} />,
        },
        {
          label: "Machine",
          page: "/report/machine",
          icon: <FileCog size={22} />,
        },
        {
          label: "Sync SAP",
          page: "/report/sync-sap",
          icon: <FileTerminal size={22} />,
        },
      ],
    },
    {
      label: "Confirm",
      page: "/confirm",
      icon: <PackageCheck />,
    },
  ];

  return (
    <>
      <motion.div
        animate={{ width: isOpenSidebar ? 260 : 58 }}
        className=' bg-white dark:bg-[#03052C] z-40 hidden dark:text-white h-full shadow-lg dark:shadow-lg-dark md:flex flex-col overflow-hidden border-r-[1px] dark:border-[#03052C] '>
        <div
          className={cn(
            "flex items-center h-min px-2 py-2 border-b-[1px] border-gray-200 dark:border-[#202020] ",
            isOpenSidebar ? "justify-between" : "justify-end"
          )}>
          <AnimatePresence>
            {isOpenSidebar && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, type: "spring" }}>
                <div className='gap-1 items-center hidden md:flex dark:text-[#F9F9F9]'>
                  <CircleUserRound size={34} />
                  <div className='flex flex-col text-sm'>
                    <p className='font-medium text-nowrap'>
                      {(dataUser?.first_name ?? "") === ""
                        ? "Anonymous"
                        : `${dataUser?.first_name} ${dataUser?.last_name}`}
                    </p>
                    <p className='-mt-1 text-[0.8rem] text-nowrap'>
                      {dataUser?.position ?? "-"} [
                      {dataUser?.role?.toLocaleUpperCase() ?? "-"}]
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleCollapsed}
            className='p-2 bg-gray-100 dark:bg-[#0B1739] rounded-md'>
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
                      ? "bg-gray-200 dark:bg-[#0B1739] text-blue-700 dark:text-purple-700"
                      : "hover:bg-gray-200 dark:hover:bg-[#0B1739] hover:text-blue-500 dark:hover:text-purple-400"
                    : item?.children
                        ?.map(({ page }) => page)
                        ?.includes(location?.pathname)
                    ? "bg-gray-100 text-blue-700 dark:text-purple-700 dark:bg-[#0B1739]"
                    : "hover:bg-gray-100 dark:hover:bg-[#0B1739]",
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
                            ? "bg-gray-200 dark:bg-[#FFFFFF20] text-blue-700 dark:text-purple-700"
                            : "hover:bg-gray-200 text-black dark:text-white dark:hover:bg-[#FFFFFF20] hover:text-blue-500 dark:hover:text-purple-400",
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
                  ? "bg-gray-200 dark:bg-[#FFFFFF20] text-blue-700 dark:text-purple-700"
                  : "hover:bg-gray-200 dark:hover:bg-[#FFFFFF20] hover:text-blue-500 dark:hover:text-purple-400"
              )}
              onClick={() => navigate("/settings")}>
              <Settings />
              {isOpenSidebar && (
                <span className=' text-[1rem] font-bold'>Settings</span>
              )}
            </div>
            <div className='px-4 py-2 border-t-[1px] border-gray-200 dark:border-[#202020] hover:bg-gray-200 dark:hover:bg-[#FFFFFF20] hover:text-red-500 cursor-pointer'>
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
