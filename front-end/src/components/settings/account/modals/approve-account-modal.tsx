import { useAccount } from "@/services/hooks";
import { TAccount } from "@/types";
import { screenSize } from "@/utils";
import { Button, Modal } from "antd";
import { FC } from "react";

export type TApproveAccountModal = {
  data: TAccount;
  onCancel: () => void;
};

export const ApproveAccountModal: FC<TApproveAccountModal> = ({
  data,
  onCancel,
}) => {
  const { mutateApproveAccount } = useAccount();
  return (
    <Modal
      title={"Approve Account"}
      open={(data?.account_id ?? "") !== ""}
      okText={"Confirm"}
      onOk={() => {
        mutateApproveAccount(data?.account_id as string);
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
          key='approve'
          type='primary'
          onClick={() => {
            mutateApproveAccount(data?.account_id as string);
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
