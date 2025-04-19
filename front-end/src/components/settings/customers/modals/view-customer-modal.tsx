import { Image } from "@/components/36S/ui/image";
import { SRC_DAMAGED_PICTURE } from "@/constants";
import { formatDateTime } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TCustomer } from "@/types";
import { screenSize } from "@/utils";
import { Input, Modal } from "antd";
import { FC } from "react";

export type TViewCustomerModal = {
  data: TCustomer;
  onCancel: () => void;
};

export const ViewCustomerModal: FC<TViewCustomerModal> = ({
  data,
  onCancel,
}) => {
  const { accounts } = useAppSelector((state) => state?.account);

  const Created = accounts?.find(
    ({ account_id }) => account_id === data?.created_by
  );

  const Deleted = accounts?.find(
    ({ account_id }) => account_id === data?.deleted_by
  );

  return (
    <Modal
      title={"View customer"}
      open={(data?.customer_id ?? "") !== ""}
      onCancel={() => {
        if (onCancel) {
          onCancel();
        }
      }}
      footer={null}
      width={
        screenSize().size === "base" || screenSize().size === "sm"
          ? "95%"
          : "max-content"
      }>
      <div className=' flex flex-col w-full gap-2'>
        <div className='flex gap-4 max-w-[30rem] justify-center items-center w-full'>
          <Image
            src={data?.logo ?? ""}
            alt='logo'
            className='!max-w-[80px] !max-h-[80px] w-[80px] h-[80px] object-cover rounded-full border-[1px] my-4 shadow-md'
          />
          <div className=' font-bold flex flex-col items-start text-lg text-slate-400 h-ful'>
            <div className=' flex gap-2 items-center justify-center text-black'>
              <p className='text-xl'>{data?.customer_name}</p>
            </div>
            <p className=' text-[0.7rem] leading-tight'>
              {data?.customer_description}
            </p>
          </div>
        </div>
        <div className='grid gap-2 grid-cols-2 w-full border-t-2'>
          <div>
            <label className='text-right text-[0.8rem]'>Creator :</label>
            <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
              <Image
                src={Created?.profile_picture ?? ""}
                srcErrorNoPicture={SRC_DAMAGED_PICTURE}
                alt='profile'
                className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
              />
              <p>{Created?.first_name}</p>
              <p>{Created?.last_name}</p>
            </div>
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>Create At :</label>
            <Input
              id='create_at'
              name='create_at'
              value={formatDateTime(data?.created_at) ?? "-"}
              readOnly
            />
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>
              Latest update At :
            </label>
            <Input
              id='updated_at'
              name='updated_at'
              value={formatDateTime(data?.updated_at) ?? "-"}
              readOnly
            />
          </div>
        </div>
        {data?.is_deleted && (
          <div className='grid gap-2 grid-cols-2 w-full border-t-2'>
            <div>
              <label className='text-right text-[0.8rem]'>Deleter :</label>
              <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
                <Image
                  src={Deleted?.profile_picture ?? ""}
                  srcErrorNoPicture={SRC_DAMAGED_PICTURE}
                  alt='profile'
                  className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
                />
                <p>{Deleted?.first_name}</p>
                <p>{Deleted?.last_name}</p>
              </div>
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>Deleted At :</label>
              <Input
                id='create_at'
                name='create_at'
                value={formatDateTime(data?.deleted_at) ?? "-"}
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
