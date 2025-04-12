import { SRC_UPLODE_PICTURE } from "@/constants";
import { Upload, UploadFile } from "antd";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { Image } from "../36S/ui/image";

export type TUploadImageFileProps = {
  data?: string | null;
  setData?: (files: File) => void;
  onDelete?: () => void;
  disabled?: boolean;
  isUplode?: boolean;
};

export const UploadImageFile: FC<TUploadImageFileProps> = ({
  data = "",
  setData = () => {},
  onDelete = () => {},
  disabled,
  isUplode,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    data === "" ? null : data ?? null
  );

  const handleChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
    const latestFile = newList[newList.length - 1];
    if (!isUplode) {
      setFileList(newList);

      if (latestFile?.originFileObj) {
        const url = URL.createObjectURL(latestFile.originFileObj);
        setPreviewUrl(url);
      }
    }

    setData(latestFile?.originFileObj as File);
  };

  const handleRemove = () => {
    setFileList([]);
    setPreviewUrl(null);
    if (onDelete) onDelete();
  };

  return (
    <div>
      {(previewUrl === undefined ? "" : previewUrl ?? "") !== "" ? (
        <div className='relative inline-block'>
          <Trash2
            className='cursor-pointer absolute top-0 right-0 text-gray-400 hover:text-red-500 hover:rotate-12 hover:scale-105 active:text-red-400 active:rotate-0 active:scale-95 z-10'
            onClick={handleRemove}
          />
          <Image
            src={previewUrl}
            alt='preview'
            className='min-w-[6rem] min-h-[6rem] w-[6rem] h-[6rem] max-w-[6rem] max-h-[6rem] cursor-pointer border-[1px] rounded-md'
          />
        </div>
      ) : (
        <Upload
          beforeUpload={() => false}
          fileList={fileList}
          onChange={handleChange}
          showUploadList={false}
          disabled={disabled}>
          <Image
            src={SRC_UPLODE_PICTURE}
            alt='upload_picture'
            className='min-w-[6rem] min-h-[6rem] w-[6rem] h-[6rem] max-w-[6rem] max-h-[6rem] cursor-pointer border-[1px] rounded-md'
          />
        </Upload>
      )}
    </div>
  );
};
