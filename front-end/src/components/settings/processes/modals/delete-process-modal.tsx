import { useProcess } from "@/services/hooks";
import { TProcess } from "@/types";
import { screenSize } from "@/utils";
import { Button, Modal } from "antd";
import { FC } from "react";

export type TDeleteProcessModal = {
  data: TProcess;
  onCancel: () => void;
};

export const DeleteProcessModal: FC<TDeleteProcessModal> = ({
  data,
  onCancel,
}) => {
  const { mutateDeleteProcess } = useProcess();
  return (
    <Modal
      title={"Delete process"}
      open={(data?.process_id ?? "") !== ""}
      okText={"Confirm"}
      onOk={() => {
        mutateDeleteProcess(data?.process_id as string);
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
            mutateDeleteProcess(data?.process_id as string);
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
      <div className='flex max-w-[34rem] justify-center items-center w-full flex-col pb-2'>
        <div className=' flex gap-2 items-center justify-center text-black'>
          <p className='text-xl '>{data?.process_name}</p>
        </div>
        <p className=' text-[0.7rem] text-center text-slate-400'>
          {data?.process_description}
        </p>
      </div>
      <p className=' w-full text-center'>
        --- Please press "Delete" to delete process. ---
      </p>
    </Modal>
  );
};
