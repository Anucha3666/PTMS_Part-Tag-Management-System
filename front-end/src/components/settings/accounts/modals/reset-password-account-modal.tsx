import { Image } from "@/components/36S/ui/image";
import { TagRole } from "@/components/common";
import { SRC_USER } from "@/constants";
import { useAccount } from "@/services/hooks";
import { TAccount } from "@/types";
import { screenSize } from "@/utils";
import { Button, Modal } from "antd";
import { FC } from "react";

export type TResetPasswordAccountModal = {
  data: TAccount;
  onCancel: () => void;
};

export const ResetPasswordAccountModal: FC<TResetPasswordAccountModal> = ({
  data,
  onCancel,
}) => {
  const { mutateResetPassword } = useAccount();
  return (
    <Modal
      title={"Reset Password"}
      open={(data?.account_id ?? "") !== ""}
      okText={"Confirm"}
      onOk={() => {
        mutateResetPassword(data?.account_id as string);
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
          key='Reset'
          type='primary'
          onClick={() => {
            mutateResetPassword(data?.account_id as string);
            onCancel();
          }}>
          Reset
        </Button>,
      ]}
      width={
        screenSize().size === "base" || screenSize().size === "sm"
          ? "95%"
          : "max-content"
      }>
      <div className='flex gap-4 justify-center items-center w-full'>
        <Image
          src={data?.profile_picture ?? ""}
          alt='profile'
          className='!max-w-[80px] !max-h-[80px] w-[80px] h-[80px] object-cover rounded-full border-[1px] my-4 shadow-md'
          srcErrorNoPicture={SRC_USER}
        />

        <div className=' font-bold flex flex-col  text-lg text-slate-400 h-ful'>
          <div className=' flex gap-2 items-center justify-center text-black'>
            <p className='text-xl'>
              {data?.first_name} {data?.last_name}
            </p>
            <TagRole role={data?.role} isView />
          </div>
          <p>{data?.position}</p>
          <p>{data?.employee_number}</p>
        </div>
      </div>
      <p className=' w-full text-center'>
        --- Please press "Reset" to reset password. ---
      </p>
    </Modal>
  );
};
