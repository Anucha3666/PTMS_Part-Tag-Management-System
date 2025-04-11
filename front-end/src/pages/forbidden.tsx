import { ForbiddenLottie } from "@/assets/lotties";
import { Button } from "antd";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";

export const ForbiddenPage = () => {
  const navigator = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md'>
        <Lottie animationData={ForbiddenLottie} loop={true} autoplay={true} />
      </div>
      <h1 className='mt-8 text-4xl font-bold text-gray-800'>403 - Forbidden</h1>
      <p className='mt-4 text-xl text-gray-600'>
        Sorry, you don't have permission to access this page.
      </p>

      <Button className='mt-8' onClick={() => navigator("/part")}>
        Return to home page
      </Button>
    </div>
  );
};
