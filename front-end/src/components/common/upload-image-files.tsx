import { SRC_UPLODE_PICTURE } from "@/constants";
import { Upload, UploadFile } from "antd";
import { Trash2 } from "lucide-react";
import { FC } from "react";
import { Image } from "../36S/ui/image";

export type TUploadImageFilesProps = {
  data?: string[];
  setData?: (files: File[]) => void;
  onDelete?: (index: number) => void;
  disabled?: boolean;
  isUplode?: boolean;
  files?: number;
};

export const UploadImageFiles: FC<TUploadImageFilesProps> = ({
  data = [],
  setData = () => {},
  onDelete = () => {},
  disabled,
  isUplode,
  files = 3,
}) => {
  const handleChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
    if (!isUplode) {
      const fileObjs = newList
        .map((file) => file.originFileObj)
        .filter(Boolean) as File[];

      setData(fileObjs);
    }
  };

  const handleRemove = (index: number) => {
    if (onDelete) onDelete(index);
  };

  return (
    <div className='flex flex-wrap gap-4'>
      {data?.map((url, index) => (
        <div key={index} className='relative inline-block'>
          <Trash2
            className='cursor-pointer absolute top-0 right-0 text-gray-400 hover:text-red-500 hover:rotate-12 hover:scale-105 active:text-red-400 active:rotate-0 active:scale-95 z-10'
            onClick={() => handleRemove(index)}
          />
          <Image
            src={url}
            alt={`preview_${index}`}
            className='min-w-[6rem] min-h-[6rem] w-[6rem] h-[6rem] max-w-[6rem] max-h-[6rem] cursor-pointer border-[1px] rounded-md'
          />
        </div>
      ))}

      {data?.length < files && (
        <Upload
          beforeUpload={() => false}
          fileList={[]}
          onChange={handleChange}
          multiple
          showUploadList={false}
          disabled={disabled}>
          <Image
            src={SRC_UPLODE_PICTURE}
            alt='upload_picture_'
            className='min-w-[6rem] min-h-[6rem] w-[6rem] h-[6rem] max-w-[6rem] max-h-[6rem] cursor-pointer border-[1px] rounded-md'
          />
        </Upload>
      )}
    </div>
  );
};
