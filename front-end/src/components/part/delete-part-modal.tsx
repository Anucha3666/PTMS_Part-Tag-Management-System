import { Modal } from "antd";
import { FC } from "react";

export type TDeletePartModal = {
  open: boolean;
  onClose?: () => void;
  isUpdate?: boolean;
};

export const DeletePartModal: FC<TDeletePartModal> = ({ open, onClose }) => {
  return (
    <Modal open={open} onCancel={onClose}>
      <text>Delete</text>
    </Modal>
  );
};
