import { Modal } from "antd";
import { FC } from "react";

export type TCreateUpdatePartModal = {
  open: boolean;
  onClose?: () => void;
  isUpdate?: boolean;
};

export const CreateUpdatePartModal: FC<TCreateUpdatePartModal> = ({
  open,
  onClose,
}) => {
  return (
    <Modal open={open} onCancel={onClose}>
      <text>test</text>
    </Modal>
  );
};
