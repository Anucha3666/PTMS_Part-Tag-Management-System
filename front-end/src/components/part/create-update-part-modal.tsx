import { TPart } from "@/types";
import { Input, Modal, Upload as UploadAntd } from "antd";
import { UploadChangeParam } from "antd/es/upload";

import { FC, useState } from "react";

export type TCreateUpdatePartModal = {
  open: boolean;
  onClose?: () => void;
  isUpdate?: boolean;
};

export type TUpload = {
  src: string;
  setSrc: (e: string) => void;
};

export const Upload: FC<TUpload> = ({ src, setSrc }) => {
  const handleChangeUpload = (info: UploadChangeParam) => {
    const latestFile = info.fileList.slice(-1)[0]?.originFileObj;
    if (latestFile) {
      const reader = new FileReader();
      reader.readAsDataURL(latestFile);
      reader.onload = () => {
        setSrc(String(reader.result ?? ""));
      };
    }
  };

  return (
    <UploadAntd
      name='avatar'
      listType='picture-card'
      className='avatar-uploader'
      showUploadList={false}
      beforeUpload={() => false}
      onChange={(e) => handleChangeUpload(e)}>
      {(src ?? "") !== "" ? (
        <img src={src} alt='uploaded' style={{ width: "100%" }} />
      ) : (
        <p>Upload</p>
      )}
    </UploadAntd>
  );
};

export const CreateUpdatePartModal: FC<TCreateUpdatePartModal> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<TPart>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose?.();
  };

  return (
    <Modal title={"Add Print"} open={open} onCancel={onClose} width={"23rem"}>
      <form onSubmit={handleSubmit} className=' -mt-6'>
        <div className='grid gap-1 py-4'>
          <div>
            <label htmlFor='part_no' className='text-right text-[0.8rem]'>
              Part No :
            </label>
            <Input
              id='part_no'
              name='part_no'
              value={formData.part_no || ""}
              onChange={handleChange}
              placeholder='Enter part no.'
            />
          </div>
          <div>
            <label htmlFor='part_name' className='text-right text-[0.8rem]'>
              Part Name :
            </label>
            <Input
              id='part_name'
              name='part_name'
              value={formData.part_name || ""}
              onChange={handleChange}
              placeholder='Enter part name.'
            />
          </div>

          <div>
            <label htmlFor='packing_std' className='text-right text-[0.8rem]'>
              Packing Std :
            </label>
            <Input
              id='packing_std'
              name='packing_std'
              type='number'
              value={formData.packing_std || ""}
              onChange={handleChange}
              placeholder='Enter packing std.'
            />
          </div>
          <div className='flex gap-2 justify-between'>
            <div className='justify-between items-center'>
              <label
                htmlFor='q_point'
                className='text-right text-[0.8rem] overflow-hidden text-nowrap w-full'>
                Picture Std :
              </label>
              <Upload
                src={formData?.picture_std ?? ""}
                setSrc={(e) => setFormData({ ...formData, picture_std: e })}
              />
            </div>
            <div className='justify-between items-center'>
              <label
                htmlFor='q_point'
                className='text-right text-[0.8rem] text-nowrap'>
                Q-Point :
              </label>
              <Upload
                src={formData?.q_point ?? ""}
                setSrc={(e) => setFormData({ ...formData, q_point: e })}
              />
            </div>
            <div className='justify-between items-center'>
              <label
                htmlFor='packing'
                className='text-right text-[0.8rem] text-nowrap'>
                Packing :
              </label>
              <Upload
                src={formData?.packing ?? ""}
                setSrc={(e) => setFormData({ ...formData, packing: e })}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor='q_point'
              className='text-right text-[0.8rem] text-nowrap'>
              More pictures :
            </label>
            <div className=' flex gap-2'>
              {Array?.from({ length: 1 })?.map(() => (
                <Upload
                  src={formData?.picture_std ?? ""}
                  setSrc={(e) => setFormData({ ...formData, picture_std: e })}
                />
              ))}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
