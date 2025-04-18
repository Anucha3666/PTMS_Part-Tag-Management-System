import { usePart } from "@/services/hooks";
import { useAppSelector } from "@/store/hook";
import { TCreatePart } from "@/types";
import { Input, Modal, Select } from "antd";
import React, { FC, useEffect, useState } from "react";
import { UploadImageFile } from "../common/upload-image-file";

export type TCreatePartModal = {
  open: boolean;
  onClose: () => void;
};

export const CreatePartModal: FC<TCreatePartModal> = ({ open, onClose }) => {
  const { mutateCreatePart } = usePart();

  const { customers } = useAppSelector((state) => state?.customer);
  const [formData, setFormData] = useState<Partial<TCreatePart>>(
    {} as TCreatePart
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value ?? 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await mutateCreatePart(formData as TCreatePart);

    if (res?.status === "success") onClose();
  };

  useEffect(() => {
    setFormData({});
  }, [open]);

  return (
    <Modal
      title={"Create Print"}
      open={open}
      onCancel={onClose}
      onClose={onClose}
      width={"23rem"}
      okText='Confirm'
      onOk={handleSubmit}>
      <form onSubmit={handleSubmit} className=' -mt-6'>
        <div className='grid gap-1 py-4'>
          <div>
            <label htmlFor='customer_name' className='text-right text-[0.8rem]'>
              Customer Name :
            </label>

            <Select
              id='customer_id'
              value={formData?.customer_id}
              placeholder='Select customer name.'
              className='w-full'
              options={customers?.map(({ customer_id, customer_name }) => ({
                value: customer_id,
                label: customer_name,
              }))}
              onChange={(e) => setFormData({ ...formData, customer_id: e })}
            />
          </div>
          <div>
            <label htmlFor='part_no' className='text-right text-[0.8rem]'>
              Part No :
            </label>
            <Input
              id='part_no'
              name='part_no'
              value={formData?.part_no ?? ""}
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
              value={formData.part_name ?? ""}
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
              value={formData.packing_std ?? ""}
              onChange={handleChange}
              placeholder='Enter packing std.'
            />
          </div>

          <div className='flex gap-2 justify-between'>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] overflow-hidden text-nowrap w-full'>
                Picture Std :
              </label>
              <UploadImageFile
                setData={(e) =>
                  setFormData({
                    ...formData,
                    picture_std: e,
                  })
                }
              />
            </div>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] text-nowrap'>
                Q-Point :
              </label>
              <UploadImageFile
                setData={(e) =>
                  setFormData({
                    ...formData,
                    q_point: e,
                  })
                }
              />
            </div>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] text-nowrap'>
                Packing :
              </label>
              <UploadImageFile
                setData={(e) =>
                  setFormData({
                    ...formData,
                    packing: e,
                  })
                }
              />
            </div>
          </div>
          <div className=' flex flex-col gap-1 items-start'>
            <label className='text-right text-[0.8rem] text-nowrap'>
              More pictures ({formData?.more_pictures?.length ?? 0}/3) :
            </label>
            <div className=' flex gap-2'>
              {formData?.more_pictures?.[0] && (
                <UploadImageFile
                  isUplode
                  data={URL.createObjectURL(
                    formData?.more_pictures?.[0] as File
                  )}
                  onDelete={() => {
                    setFormData({
                      ...formData,
                      more_pictures: formData?.more_pictures?.slice(1),
                    });
                  }}
                />
              )}
              {formData?.more_pictures?.[1] && (
                <UploadImageFile
                  isUplode
                  data={URL.createObjectURL(
                    formData?.more_pictures?.[1] as File
                  )}
                  onDelete={() => {
                    setFormData({
                      ...formData,
                      more_pictures: formData?.more_pictures
                        ?.slice(0, 1)
                        ?.concat(formData?.more_pictures?.slice(2)),
                    });
                  }}
                />
              )}
              {formData?.more_pictures?.[2] && (
                <UploadImageFile
                  isUplode
                  data={URL.createObjectURL(
                    formData?.more_pictures?.[2] as File
                  )}
                  onDelete={() => {
                    setFormData({
                      ...formData,
                      more_pictures: formData?.more_pictures?.slice(0, 2),
                    });
                  }}
                />
              )}

              {(formData?.more_pictures?.length ?? 0) < 3 && (
                <UploadImageFile
                  isUplode
                  setData={(e) =>
                    setFormData({
                      ...formData,
                      more_pictures: (formData?.more_pictures ?? [])?.concat(e),
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
