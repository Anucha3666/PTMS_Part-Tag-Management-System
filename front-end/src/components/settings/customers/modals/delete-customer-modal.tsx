import { Image } from "@/components/36S/ui/image";
import { useCustomer } from "@/services/hooks";
import { TCustomer } from "@/types";
import { screenSize } from "@/utils";
import { Button, Modal } from "antd";
import { FC } from "react";

export type TDeleteCustomerModal = {
  data: TCustomer;
  onCancel: () => void;
};

export const DeleteCustomerModal: FC<TDeleteCustomerModal> = ({
  data,
  onCancel,
}) => {
  const { mutateDeleteCustomer } = useCustomer();
  return (
    <Modal
      title={"Delete customer"}
      open={(data?.customer_id ?? "") !== ""}
      okText={"Confirm"}
      onOk={() => {
        mutateDeleteCustomer(data?.customer_id as string);
        if (onCancel) {
          onCancel();
        }
      }}
      onCancel={() => {
        if (onCancel) {
          onCancel();
        }
      }}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key='delete'
          type='primary'
          danger
          onClick={() => {
            mutateDeleteCustomer(data?.customer_id as string);
            onCancel();
          }}>
          Delete
        </Button>,
      ]}
      width={
        screenSize().size === "base" || screenSize().size === "sm"
          ? "95%"
          : "max-content"
      }>
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
      <p className=' w-full text-center'>
        --- Please press "Delete" to delete customer. ---
      </p>
    </Modal>
  );
};
