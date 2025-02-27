import { FC, useState } from "react";
import Upload, { UploadChangeParam } from "antd/es/upload";
import { Eye, ImageOff, ImageUp, Loader, Trash2 } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export type TUpload = {
  src: string;
  setSrc?: (e: string) => void;
  disabled?: boolean;
};

export const UploadImage: FC<TUpload> = ({ src, setSrc, disabled }) => {
  const [isLoading, setIsLoading] = useState(false);

  const isNotSetSrc = !setSrc;
  const handleChangeUpload = (info: UploadChangeParam) => {
    setIsLoading(true);
    const latestFile = info.fileList.slice(-1)[0]?.originFileObj;
    if (latestFile) {
      const reader = new FileReader();
      reader.readAsDataURL(latestFile);
      reader.onload = () => {
        if (!isNotSetSrc) {
          setSrc(String(reader.result ?? ""));
        }
      };
    }
    setIsLoading(false);
  };

  return (
    <Upload
      name='avatar'
      listType='picture-card'
      className='avatar-uploader relative'
      showUploadList={false}
      beforeUpload={() => false}
      onChange={(e) => handleChangeUpload(e)}
      disabled={disabled || (src ?? "") !== ""}>
      {isLoading ? (
        <div className='flex gap-1 flex-col justify-center items-center'>
          <Loader className=' animate-spin' />
          <p className=' text-[0.7rem] font-bold'>Loading</p>
        </div>
      ) : (src ?? "") !== "" ? (
        <>
          {!isNotSetSrc && (
            <Trash2
              size={20}
              className=' absolute -top-[6px] -right-[6px] text-slate-400 hover:text-red-500 hover:scale-105 !cursor-pointer z-10'
              onClick={() => setSrc("")}
            />
          )}
          <PhotoProvider>
            <PhotoView key={src} src={src}>
              <div className=' w-full h-full !cursor-pointer z-10 rounded-md overflow-hidden'>
                <div className=' w-full h-full flex items-center justify-center relative'>
                  <div className=' w-[100%] h-[100%] absolute flex justify-center items-center z-20 text-transparent hover:text-slate-200 hover:bg-[#77777720]  '>
                    <Eye />
                  </div>
                  <img src={src} alt='uploaded' style={{ width: "100%" }} />
                </div>
              </div>
            </PhotoView>
          </PhotoProvider>
        </>
      ) : (
        <div className='flex flex-col gap-1 justify-center items-center'>
          {disabled ? <ImageOff /> : <ImageUp />}
          <p className=' text-[0.7rem] font-bold'>
            {disabled ? "No picture" : "Upload"}
          </p>
        </div>
      )}
    </Upload>
  );
};
