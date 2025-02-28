import { LoginForm } from "@/components/common/form";

import { FC } from "react";

export const LoginPage: FC = () => {
  return (
    <div
      className={`w-screen h-screen flex justify-end pr-8`}
      style={{
        backgroundImage:
          "url('https://www.kacha.co.th/wp-content/uploads/2023/08/AnyConv.com__219.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className=' h-min w-[24rem] rounded-b-3xl flex flex-col gap-4 border-l-2 border-[#00000090] p-10 shadow-2xl backdrop-blur-md bg-[#00000090]'>
        <div className=' flex flex-col gap-2 items-center text-white'>
          <img
            src={
              "https://raw.githubusercontent.com/Anucha3666/PTMS_PartTag-Manager-System/refs/heads/main/media/images/icon-ptms-white.png"
            }
            alt='icon-ptms'
            className=' w-[6rem] h-max'
          />
          <div className=' text-xl flex flex-col items-center justify-center'>
            <p
              className='text-4xl font-bold'
              style={{ fontFamily: "Oswald, sans-serif" }}>
              PTMS
            </p>
            <p className=' -mt-2 text-[1.2rem] font-bold'>
              Part Tag Manager System
            </p>
          </div>
        </div>

        <div className=' text-[#FFFFFFF0]'>
          <p className=' text-2xl'>Welcome back</p>
          <p className='text-[#FFFFFFA0] font-normal'>
            Please enter your details
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};
