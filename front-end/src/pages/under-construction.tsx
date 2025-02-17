import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export const UnderConstructionPage = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("https://assets2.lottiefiles.com/packages/lf20_yyytgjwe.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='w-full max-w-md'>
        {animationData && (
          <Lottie animationData={animationData} loop={true} autoplay={true} />
        )}
      </div>
      <h1 className='mt-8 text-4xl font-bold text-gray-800 dark:text-gray-400'>
        อยู่ระหว่างการพัฒนา
      </h1>
      <p className='mt-4 text-xl text-gray-600 dark:text-gray-500 text-center max-w-md'>
        ขออภัยในความไม่สะดวก
        เรากำลังปรับปรุงเว็บไซต์เพื่อประสบการณ์ที่ดียิ่งขึ้น
      </p>
    </div>
  );
};
