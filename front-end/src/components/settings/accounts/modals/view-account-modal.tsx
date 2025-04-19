import { Image } from "@/components/36S/ui/image";
import { TagRole } from "@/components/common";
import { SRC_USER } from "@/constants";
import { formatDateTime } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TAccount } from "@/types";
import { Input, Modal } from "antd";
import { FC } from "react";

export type TViewAccountModal = {
  open: TAccount;
  onClose: () => void;
};

export const ViewAccountModal: FC<TViewAccountModal> = ({ open, onClose }) => {
  const { accounts } = useAppSelector((state) => state?.account);

  const Creator = accounts?.find(
    ({ account_id }) => account_id === open?.created_by
  );

  const Deleter = accounts?.find(
    ({ account_id }) => account_id === open?.deleted_by
  );

  const Approver = accounts?.find(
    ({ account_id }) => account_id === open?.approved_by
  );

  console.log(open);

  return (
    <Modal
      title={"View Account"}
      open={(open?.account_id ?? "") !== ""}
      onCancel={onClose}
      width={"44rem"}
      footer={<></>}>
      <div className='w-full flex flex-col gap-4'>
        <div className='flex gap-4 justify-center items-center w-full'>
          <Image
            src={open?.profile_picture ?? ""}
            alt='profile'
            className='!max-w-[80px] !max-h-[80px] w-[80px] h-[80px] object-cover rounded-full border-[1px] my-4 shadow-md'
            srcErrorNoPicture={SRC_USER}
          />

          <div className=' font-bold flex flex-col  text-lg text-slate-400 h-ful'>
            <div className=' flex gap-2 items-center justify-center text-black'>
              <p className='text-xl'>
                {open?.first_name} {open?.last_name}
              </p>
              <TagRole role={open?.role} isView />
            </div>
            <p>{open?.position}</p>
            <p>{open?.employee_number}</p>
          </div>
        </div>

        <div className='grid gap-2 grid-cols-2 w-full border-t-2'>
          <div>
            <label className='text-right text-[0.8rem]'>Creator :</label>
            <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
              <Image
                src={Creator?.profile_picture ?? ""}
                srcErrorNoPicture={SRC_USER}
                alt='created_profile'
                className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
              />
              <p>{Creator?.first_name}</p>
              <p>{Creator?.last_name}</p>
            </div>
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>Create At :</label>
            <Input
              id='create_at'
              name='create_at'
              value={formatDateTime(open.created_at) ?? "-"}
              readOnly
            />
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>
              Latest update At :
            </label>
            <Input
              id='update_at'
              name='update_at'
              value={formatDateTime(open.created_at) ?? "-"}
              readOnly
            />
          </div>
        </div>
        {(open?.approved_by ?? "") !== "" && (
          <div className='grid gap-2 grid-cols-2 w-full border-t-2'>
            <div>
              <label className='text-right text-[0.8rem]'>
                {open?.is_approved ? "Approver" : "Rejector"} :
              </label>
              <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
                <Image
                  src={Approver?.profile_picture ?? ""}
                  srcErrorNoPicture={SRC_USER}
                  alt='approver_profile'
                  className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
                />
                <p>{Approver?.first_name}</p>
                <p>{Approver?.last_name}</p>
              </div>
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>
                {open?.is_approved ? "Approved" : "Rejected"} At :
              </label>
              <Input
                id='approved_at'
                name='approved_at'
                value={formatDateTime(open?.approved_at ?? "") ?? "-"}
                readOnly
              />
            </div>
          </div>
        )}
        {open?.is_deleted && (
          <div className='grid gap-2 grid-cols-2 w-full border-t-2'>
            <div>
              <label className='text-right text-[0.8rem]'>Deleter :</label>
              <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
                <Image
                  src={Deleter?.profile_picture ?? ""}
                  srcErrorNoPicture={SRC_USER}
                  alt='deleter_profile'
                  className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
                />
                <p>{Deleter?.first_name}</p>
                <p>{Deleter?.last_name}</p>
              </div>
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>Deleted At :</label>
              <Input
                id='deleted_at'
                name='deleted_at'
                value={formatDateTime(open?.deleted_at ?? "") ?? "-"}
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
