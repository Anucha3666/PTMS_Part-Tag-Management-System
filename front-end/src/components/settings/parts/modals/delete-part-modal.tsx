import { usePart } from "@/services/hooks";
import { TPart } from "@/types";
import { Modal } from "antd";
import { FC } from "react";

type TDataModalPart = TPart & {
  order: "view" | "update" | "delete" | "create";
};

export type TDeletePartModal = {
  open: TDataModalPart;
  onClose?: () => void;
};

export const DeletePartModal: FC<TDeletePartModal> = ({ open, onClose }) => {
  const { mutateDeletePart } = usePart();
  return (
    <Modal
      title={"Delete Part"}
      open={open?.order === "delete"}
      okText={"Delete"}
      okButtonProps={{
        style: { backgroundColor: "red", borderColor: "red", color: "white" },
      }}
      onCancel={onClose}
      onOk={() => {
        mutateDeletePart(open?.part_id);
        if (onClose) onClose();
      }}>
      <text>Please press "Delete" to delete part {`"${open?.part_no}"`}. </text>
    </Modal>
  );
};
