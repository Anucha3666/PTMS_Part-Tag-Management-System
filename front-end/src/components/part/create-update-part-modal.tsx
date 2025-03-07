import { usePart } from "@/services/hooks";
import { useAppSelector } from "@/store/hook";
import { TPart } from "@/types";
import { Input, Modal } from "antd";
import React, { FC, Fragment, useEffect, useState } from "react";
import { UploadImage } from "../common/upload-image";

type TDataModalPart = TPart & { order: "view" | "update" | "delete" };

export type TCreateUpdatePartModal = {
  open: boolean;
  onClose: () => void;
  data?: TDataModalPart;
};

export const CreateUpdatePartModal: FC<TCreateUpdatePartModal> = ({
  open,
  onClose,
  data = {} as TDataModalPart,
}) => {
  const { mutateCreatePart, mutateUpdatePart } = usePart();

  const { dataUser } = useAppSelector((state) => state.utils);
  const { parts } = useAppSelector((state) => state.parts);
  const [formData, setFormData] = useState<Partial<TPart>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value ?? 0) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((data?.order ?? "") === "update") {
      mutateUpdatePart(formData as TPart);
    } else {
      mutateCreatePart({ ...formData, creator: dataUser?.full_name } as TPart);
      if (parts?.length < 7) window.location.reload();
    }
    onClose();
  };

  useEffect(() => {
    setFormData({});
  }, [open]);

  useEffect(() => {
    if ((data?.order ?? "") === "update") setFormData(data);
  }, [data]);

  return (
    <Modal
      title={"Add Print"}
      open={open}
      onCancel={onClose}
      width={"23rem"}
      onOk={handleSubmit}>
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
              <label className='text-right text-[0.8rem] overflow-hidden text-nowrap w-full'>
                Picture Std :
              </label>
              <UploadImage
                src={formData?.picture_std ?? ""}
                setSrc={(e) => setFormData({ ...formData, picture_std: e })}
              />
            </div>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] text-nowrap'>
                Q-Point :
              </label>
              <UploadImage
                src={formData?.q_point ?? ""}
                setSrc={(e) => setFormData({ ...formData, q_point: e })}
              />
            </div>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] text-nowrap'>
                Packing :
              </label>
              <UploadImage
                src={formData?.packing ?? ""}
                setSrc={(e) => setFormData({ ...formData, packing: e })}
              />
            </div>
          </div>
          <div className=' flex flex-col gap-1 items-start'>
            <label className='text-right text-[0.8rem] text-nowrap'>
              More pictures ({formData?.more_pictures?.length ?? 0}/3) :
            </label>
            <div className=' flex gap-2'>
              {Array?.from({
                length:
                  (formData?.more_pictures?.length ?? 0) + 1 >= 3
                    ? 3
                    : (formData?.more_pictures?.length ?? 0) + 1,
              })?.map((_, i) => (
                <Fragment key={i}>
                  <UploadImage
                    src={(formData?.more_pictures ?? [])[i] ?? ""}
                    setSrc={(e) =>
                      e === ""
                        ? setFormData({
                            ...formData,
                            more_pictures: (formData?.more_pictures ?? [])
                              ?.slice(0, i)
                              ?.concat(
                                (formData?.more_pictures ?? [])?.slice(i + 1)
                              ),
                          })
                        : setFormData({
                            ...formData,
                            more_pictures: (
                              formData?.more_pictures ?? []
                            )?.concat(e ?? ""),
                          })
                    }
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
