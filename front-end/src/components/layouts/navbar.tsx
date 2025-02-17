import { Button, Segmented } from "antd";
import iconCCT from "/assets/images/icon-cct.png";
import { useScreen } from "@/hooks";
import { CircleUserRound, Expand, LogOut, Shrink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AppNavbar = () => {
  const navigate = useNavigate();
  const { isFullScreen, toggleScreen } = useScreen();

  return (
    <div className=' w-full h-min  grid grid-cols-3 bg-white justify-between gap-1 p-2 items-center shadow-md'>
      <div className=' flex gap-1 items-center'>
        <img src={iconCCT} alt='' className=' w-[2.4rem] h-max' />
        <div className='!w-[4px] h-[34px] rounded-full bg-black' />
        <div className=' text-sm'>
          <p className=' text-lg font-bold'>CCT</p>
          <p className=' -mt-2'>Control Compare Tags</p>
        </div>
      </div>

      <div className=' w-full flex justify-center items-center'>
        <Segmented<string>
          options={["Part Management", "Report"]}
          onChange={(value) => {
            navigate(`/${value?.split(" ")?.join("-")?.toLocaleLowerCase()}`);
          }}
          className='p-1'
        />
      </div>

      <div className='flex  w-full justify-end gap-2 items-center'>
        <div className='gap-1 items-center hidden md:flex '>
          <CircleUserRound size={34} />
          <div className=' flex flex-col text-sm'>
            <p className=' font-medium'>full_name</p>
            <p className=' -mt-1 text-[0.8rem]'>{"position"} ["role"]</p>
          </div>
        </div>

        <Button className='p-1'>
          <LogOut />
        </Button>

        <Button className='p-1' onClick={() => toggleScreen()}>
          {isFullScreen ? <Shrink /> : <Expand />}
        </Button>
      </div>
    </div>
  );
};
