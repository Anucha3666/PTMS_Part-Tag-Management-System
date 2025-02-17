import { Modal } from "antd";
import { FC } from "react";

export type TViewPartModal = {
  open: boolean;
  onClose?: () => void;
  isUpdate?: boolean;
};

export const ViewPartModal: FC<TViewPartModal> = ({ open, onClose }) => {
  return (
    <Modal open={open} onCancel={onClose}>
      <text>View</text>
    </Modal>
  );
};
