import { TPart } from "@/types";
import { Base64, FileType } from "@/utils/base64";
import { Input, Modal, Upload, UploadProps } from "antd";
import { FC, useState } from "react";

export type TCreateUpdatePartModal = {
  open: boolean;
  onClose?: () => void;
  isUpdate?: boolean;
};

export const CreateUpdatePartModal: FC<TCreateUpdatePartModal> = ({
  open,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<TPart>>({});
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

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

  const handleUpload: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      Base64.get(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  console.log(formData);
  console.log(imageUrl);

  return (
    <Modal open={open} onCancel={onClose} width={"23rem"}>
      <form onSubmit={handleSubmit}>
        <div className='grid gap-2 py-4'>
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
                name='avatar'
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                onChange={handleUpload}>
                <p>{loading ? "Upload" : "Loading"}</p>
              </Upload>
            </div>
            <div className='justify-between items-center'>
              <label
                htmlFor='q_point'
                className='text-right text-[0.8rem] text-nowrap'>
                Q-Point :
              </label>
              <Upload
                name='avatar'
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}>
                <p>Upload</p>
              </Upload>
            </div>
            <div className='justify-between items-center'>
              <label
                htmlFor='q_point'
                className='text-right text-[0.8rem] text-nowrap'>
                Packing :
              </label>
              <Upload
                name='avatar'
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}>
                <p>Upload</p>
              </Upload>
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
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={false}>
                  <p>Upload</p>
                </Upload>
              ))}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
