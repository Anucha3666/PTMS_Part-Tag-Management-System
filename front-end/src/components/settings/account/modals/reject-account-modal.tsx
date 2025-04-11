import { useAccount } from "@/services/hooks";
import { TAccount } from "@/types";
import { screenSize } from "@/utils";
import { Button, Modal } from "antd";
import { FC } from "react";

export type TRejectAccountModal = {
  data: TAccount;
  onCancel: () => void;
};

export const RejectAccountModal: FC<TRejectAccountModal> = ({
  data,
  onCancel,
}) => {
  const { mutateRejectAccount } = useAccount();
  return (
    <Modal
      title={"Approve Account"}
      open={(data?.account_id ?? "") !== ""}
      okText={"Confirm"}
      onOk={() => {
        mutateRejectAccount(data?.account_id as string);
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
          key='reject'
          type='primary'
          danger
          onClick={() => {
            mutateRejectAccount(data?.account_id as string);
            onCancel();
          }}>
          Confirm
        </Button>,
      ]}
      width={
        screenSize().size === "base" || screenSize().size === "sm"
          ? "95%"
          : "max-content"
      }>
      <p className=' w-full text-center'>
        --- Please press "Confirm" to approve account. ---
      </p>
    </Modal>
  );
};
