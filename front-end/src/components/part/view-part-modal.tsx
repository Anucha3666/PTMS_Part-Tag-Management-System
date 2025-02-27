import { TPart } from "@/types";
import { Input, Modal } from "antd";
import { FC, Fragment } from "react";
import { UploadImage } from "../common/upload-image";
import { formatDateTime } from "@/helpers";

type TDataModalPart = TPart & { order: "view" | "update" | "delete" };

export type TViewPartModal = {
  open: TDataModalPart;
  onClose: () => void;
};

export const ViewPartModal: FC<TViewPartModal> = ({ open, onClose }) => {
  return (
    <Modal
      title={"View Part"}
      open={open?.order === "view"}
      onCancel={onClose}
      width={"44rem"}>
      <div className='grid gap-2 grid-cols-2 py-4 -mt-6 w-full'>
        <div>
          <label className='text-right text-[0.8rem]'>Part No :</label>
          <Input
            id='part_no'
            name='part_no'
            value={open.part_no || ""}
            placeholder='Enter part no.'
            readOnly
          />
        </div>
        <div>
          <label className='text-right text-[0.8rem]'>Part Name :</label>
          <Input
            id='part_name'
            name='part_name'
            value={open.part_name || ""}
            placeholder='Enter part name.'
            readOnly
          />
        </div>
        <div>
          <label className='text-right text-[0.8rem]'>Packing Std :</label>
          <Input
            id='packing_std'
            name='packing_std'
            type='number'
            value={open.packing_std || ""}
            placeholder='Enter packing std.'
            readOnly
          />
        </div>
        <div>
          <label className='text-right text-[0.8rem]'>Creator :</label>
          <Input
            id='creator'
            name='creator'
            value={open.creator ?? "-"}
            readOnly
          />
        </div>
        <div>
          <label className='text-right text-[0.8rem]'>Create At :</label>
          <Input
            id='create_at'
            name='create_at'
            value={formatDateTime(open.create_at) ?? "-"}
            readOnly
          />
        </div>
        <div>
          <label className='text-right text-[0.8rem]'>Update At :</label>
          <Input
            id='update_at'
            name='update_at'
            value={formatDateTime(open.update_at) ?? "-"}
            readOnly
          />
        </div>
        <div className='flex gap-2 justify-between'>
          <div className='justify-between items-center'>
            <label className='text-right text-[0.8rem] overflow-hidden text-nowrap w-full'>
              Picture Std :
            </label>
            <UploadImage src={open?.picture_std ?? ""} disabled />
          </div>
          <div className='justify-between items-center'>
            <label className='text-right text-[0.8rem] text-nowrap'>
              Q-Point :
            </label>
            <UploadImage src={open?.q_point ?? ""} disabled />
          </div>
          <div className='justify-between items-center'>
            <label className='text-right text-[0.8rem] text-nowrap'>
              Packing :
            </label>
            <UploadImage src={open?.packing ?? ""} disabled />
          </div>
        </div>
        <div className=' flex flex-col gap-1 items-start'>
          <label className='text-right text-[0.8rem] text-nowrap'>
            More pictures ({open?.more_pictures?.length ?? 0}/3) :
          </label>
          <div className=' flex gap-2'>
            {open?.more_pictures?.map((src, i) => (
              <Fragment key={i}>
                <UploadImage src={src ?? ""} disabled />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
