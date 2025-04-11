import { LoginForm, SignUpForm } from "@/components/common/form";

import { motion } from "motion/react";
import { FC, useState } from "react";

export const LoginPage: FC = () => {
  const [order, setOrder] = useState<string>("");
  return (
    <div
      className={`w-screen h-screen flex justify-center items-center md:items-start md:justify-end overflow-hidden md:pr-8`}
      style={{
        backgroundImage:
          "url('https://www.kacha.co.th/wp-content/uploads/2023/08/AnyConv.com__219.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <motion.div
        layout
        layoutId={"layout-login"}
        className=' h-min w-[22rem] rounded-xl md:rounded-b-3xl flex flex-col gap-2 border-l-2 border-[#00000090] p-10 shadow-2xl backdrop-blur-md bg-[#00000090]'>
        <div className=' flex flex-col gap-2 items-center text-white'>
          <img
            src={
              "https://raw.githubusercontent.com/Anucha3666/PTMS_Part-Tag-Management-System/refs/heads/main/media/images/icon-ptms.png"
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
            <p className=' -mt-2 text-[1.18rem] font-bold'>
              Part Tag Management System
            </p>
          </div>
        </div>

        {order === "sign-up" ? (
          <motion.div
            layout
            layoutId={"sign-up"}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className=' text-[#FFFFFFF0] pb-2'>
              <p className=' text-2xl'>Sign Up</p>
              <p className='text-[#FFFFFFA0] font-normal'>
                Please enter your details
              </p>
            </div>

            <SignUpForm {...{ setOrder }} />

            <div className=' pt-2 flex justify-center items-center text-[0.9rem] gap-2 text-[#FFFFFFA0] font-normal'>
              <p>Have an Asscunt ?</p>
              <p
                className=' text-blue-400 underline cursor-pointer hover:text-blue-500 hover:scale-105 active:scale-105'
                onClick={() => setOrder("sign-in")}>
                Sign in
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            layout
            layoutId={"sign-in"}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className=' text-[#FFFFFFF0] pb-2'>
              <p className=' text-2xl'>
                {order === "" ? "Welcome back" : "Sign In"}
              </p>
              <p className='text-[#FFFFFFA0] font-normal'>
                Please enter your details
              </p>
            </div>

            <LoginForm />

            <div className=' pt-2 flex justify-center items-center text-[0.9rem] gap-2 text-[#FFFFFFA0] font-normal'>
              <p>No Asscunt ?</p>
              <p
                className=' text-blue-400 underline cursor-pointer hover:text-blue-500 hover:scale-105 active:scale-105'
                onClick={() => setOrder("sign-up")}>
                Sign Up
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
