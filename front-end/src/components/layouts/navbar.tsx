import { useScreen } from "@/hooks";
import { Button } from "antd";
import { Expand, LogOut, Shrink } from "lucide-react";
import { useState } from "react";
import { LogOutModal } from "./log-out-modal";

export const AppNavbar = () => {
  const { isFullScreen, toggleScreen } = useScreen();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className=' w-full h-min flex justify-between bg-white  gap-1 p-2 items-center shadow-md z-20'>
        <div className=' flex gap-2 w-full items-center'>
          <img
            src={
              "https://raw.githubusercontent.com/Anucha3666/PTMS_Part-Tag-Management-System/refs/heads/main/media/images/icon-ptms.png"
            }
            alt='icon-ptms'
            className=' w-[2.4rem] h-max'
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

        <div className='flex  w-full justify-end gap-2 items-center'>
          <Button className='p-1' onClick={() => setIsOpen(true)}>
            <LogOut />
          </Button>

          <Button className='p-1' onClick={() => toggleScreen()}>
            {isFullScreen ? <Shrink /> : <Expand />}
          </Button>
        </div>
      </div>
      <LogOutModal {...{ isOpen, setIsOpen }} />
    </>
  );
};
