import { useScreen } from "@/hooks";
import { useAppSelector } from "@/store/hook";
import { Button, Segmented } from "antd";
import { CircleUserRound, Expand, LogOut, Shrink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOutModal } from "./log-out-modal";

export const AppNavbar = () => {
  const navigate = useNavigate();
  const { isFullScreen, toggleScreen } = useScreen();
  const { dataUser } = useAppSelector((state) => state.utils);
  const { parts } = useAppSelector((state) => state.parts);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className=' w-full h-min  grid grid-cols-3 bg-white justify-between gap-1 p-2 items-center shadow-md'>
        <div className=' flex gap-2 items-center'>
          <img
            src={
              "https://raw.githubusercontent.com/Anucha3666/PTMS_PartTag-Manager-System/refs/heads/main/media/images/icon-ptms.png"
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
              Part Tag Manager System
            </p>
          </div>
        </div>

        <div className=' w-full flex justify-center items-center'>
          <Segmented<string>
            options={["Part Management", "Report"]}
            onChange={(value) => {
              navigate(`/${value?.split(" ")?.join("-")?.toLocaleLowerCase()}`);
              if (value === "Part Management" && parts?.length < 7)
                window.location.reload();
            }}
            className=' w-min p-1 gap-2'
          />
        </div>

        <div className='flex  w-full justify-end gap-2 items-center'>
          <div className='gap-1 items-center hidden md:flex '>
            <CircleUserRound size={34} />
            <div className=' flex flex-col text-sm'>
              <p className=' font-medium'>{dataUser?.full_name}</p>
              <p className=' -mt-1 text-[0.8rem]'>
                {dataUser?.position} [{dataUser?.role}]
              </p>
            </div>
          </div>

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
