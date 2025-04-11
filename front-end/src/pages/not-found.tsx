import { Button } from "antd";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigator = useNavigate();
  const [animationData, setAnimationData] = useState(null);
  const [data, setData] = useState<(string | FileList | null)[]>([
    "test",
    "test",
  ]);

  console.log(data);

  useEffect(() => {
    fetch("https://assets3.lottiefiles.com/packages/lf20_kcsr6fcp.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <input
        type='file'
        id='files'
        onChange={(e) => setData(data?.concat(e?.target?.files))}
      />
      <div className='w-full max-w-md'>
        {animationData && (
          <Lottie animationData={animationData} loop={true} autoplay={true} />
        )}
      </div>
      <h1 className='mt-8 text-4xl font-bold text-gray-800'>
        404 - The page you requested was not found.
      </h1>
      <p className='mt-4 text-xl text-gray-600'>
        Sorry, we couldn't find the page you were looking for.
      </p>

      <Button className='mt-8' onClick={() => navigator("/part")}>
        Return to home page
      </Button>
    </div>
  );
};
