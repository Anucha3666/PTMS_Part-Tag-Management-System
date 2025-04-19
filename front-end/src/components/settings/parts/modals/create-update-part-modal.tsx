import { UploadImageFiles } from "@/components/common";
import { usePart } from "@/services/hooks";
import { useAppSelector } from "@/store/hook";
import { TCreatePart, TPart, TUpdatePart } from "@/types";
import { Input, Modal, Select } from "antd";
import React, { FC, useEffect, useState } from "react";
import { UploadImageFile } from "../../../common/upload-image-file";

type TDataModalPart = (TPart & TCreatePart) &
  (TUpdatePart & {
    order: "view" | "update" | "delete" | "create";
  });

export type TCreateUpdatePartModal = {
  open: TDataModalPart;
  onClose: () => void;
};

export const CreateUpdatePartModal: FC<TCreateUpdatePartModal> = ({
  open,
  onClose,
}) => {
  const { mutateCreatePart, mutateUpdatePart } = usePart();

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

    const res =
      open?.order === "create"
        ? await mutateCreatePart(formData as TCreatePart)
        : await mutateUpdatePart(formData as TUpdatePart);

    if (res?.status === "success") onClose();
  };

  useEffect(() => {
    setFormData({ ...open, customer_id: open?.customer?.customer_id ?? "" });
  }, [open]);

  return (
    <Modal
      title={`${open?.order?.slice(0, 1)?.toUpperCase()}${open?.order?.slice(
        1
      )} print`}
      open={open?.order === "create" || open?.order === "update"}
      onCancel={onClose}
      onClose={onClose}
      width={"23rem"}
      okText='Confirm'
      onOk={handleSubmit}>
      <form onSubmit={handleSubmit} className=' -mt-6'>
        <div className='grid gap-1 py-4'>
          <div>
            <div className=' flex gap-1'>
              <p className=' text-red-500'>*</p>
              <label
                htmlFor='customer_name'
                className='text-right text-[0.8rem]'>
                Customer Name :
              </label>
            </div>

            <Select
              id='customer_id'
              value={formData?.customer_id}
              placeholder='Select customer name.'
              className='w-full'
              options={customers
                ?.filter(({ is_deleted }) => !is_deleted)
                ?.map(({ customer_id, customer_name }) => ({
                  value: customer_id,
                  label: customer_name,
                }))}
              onChange={(e) => setFormData({ ...formData, customer_id: e })}
            />
          </div>
          <div>
            <div className=' flex gap-1'>
              <p className=' text-red-500'>*</p>
              <label htmlFor='part_no' className='text-right text-[0.8rem]'>
                Part No :
              </label>
            </div>
            <Input
              id='part_no'
              name='part_no'
              value={formData?.part_no ?? ""}
              onChange={handleChange}
              placeholder='Enter part no.'
            />
          </div>
          <div>
            <div className=' flex gap-1'>
              <p className=' text-red-500'>*</p>
              <label htmlFor='part_name' className='text-right text-[0.8rem]'>
                Part Name :
              </label>
            </div>
            <Input
              id='part_name'
              name='part_name'
              value={formData.part_name ?? ""}
              onChange={handleChange}
              placeholder='Enter part name.'
            />
          </div>

          <div>
            <div className=' flex gap-1'>
              <p className=' text-red-500'>*</p>
              <label htmlFor='packing_std' className='text-right text-[0.8rem]'>
                Packing Std :
              </label>
            </div>
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
                data={open?.picture_std ?? ""}
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
                data={open?.q_point ?? ""}
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
                data={open?.packing ?? ""}
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
              <UploadImageFiles
                data={formData?.more_pictures?.map((more_picture) =>
                  typeof more_picture === "string"
                    ? more_picture
                    : URL.createObjectURL(more_picture)
                )}
                setData={(e) => {
                  setFormData({
                    ...formData,
                    more_pictures: formData?.more_pictures?.concat(e),
                  });
                }}
                onDelete={(i) => {
                  setFormData({
                    ...formData,
                    more_pictures: formData?.more_pictures
                      ?.slice(0, i)
                      ?.concat(formData?.more_pictures?.slice(i + 1)),
                  });
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
