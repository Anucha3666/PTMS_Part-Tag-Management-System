import { FC } from "react";

export const LoginPage: FC = () => {
  return (
    <div
      className={`w-screen h-screen flex justify-end`}
      style={{
        backgroundImage:
          "url('https://www.kacha.co.th/wp-content/uploads/2023/08/AnyConv.com__219.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className=' h-full w-[30rem] border-l-2 border-[#00000090] p-4 shadow-lg backdrop-blur-md bg-[#00000090]'>
        <div className=' flex gap-2 items-center text-white'>
          <img
            src={
              "https://raw.githubusercontent.com/Anucha3666/PTMS_PartTag-Manager-System/refs/heads/main/media/images/icon-ptms.png"
            }
            alt='icon-ptms'
            className=' w-[3.8rem] h-max'
          />
          <div className='!w-[6px] h-[50px] rounded-full  bg-white  shadow-inner' />
          <div className=' text-xl'>
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
      </div>
    </div>
  );
};
