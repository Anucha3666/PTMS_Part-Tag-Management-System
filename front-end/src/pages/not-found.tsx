import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigator = useNavigate();
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("https://assets3.lottiefiles.com/packages/lf20_kcsr6fcp.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md'>
        {animationData && (
          <Lottie animationData={animationData} loop={true} autoplay={true} />
        )}
      </div>
      <h1 className='mt-8 text-4xl font-bold text-gray-800'>
        404 - ไม่พบหน้าที่คุณต้องการ
      </h1>
      <p className='mt-4 text-xl text-gray-600'>
        ขออภัย เราไม่สามารถหาหน้าที่คุณกำลังมองหาได้
      </p>

      <Button className='mt-8' onClick={() => navigator("/part-management")}>
        กลับไปยังหน้าหลัก
      </Button>
    </div>
  );
};
