import { TTag } from "@/types";
import { screenSize } from "@/utils";
import { Modal } from "antd";
import { FC } from "react";

export type TViewTagModal = {
  data: TTag;
  onCancel: () => void;
};

export const ViewTagModal: FC<TViewTagModal> = ({ data, onCancel }) => {
  return (
    <Modal
      title={"View PDF Printed"}
      open={(data?.printed_id ?? "") !== ""}
      onCancel={() => {
        if (onCancel) {
          onCancel();
        }
      }}
      footer={null}
      width={
        screenSize().size === "base" || screenSize().size === "sm"
          ? "95%"
          : "54.6rem"
      }>
      <div className='w-full !h-[80vh] overflow-auto bg-[#525659]'>
        <div className='flex w-full rounded-md overflow-hidden flex-col space-y-2'></div>
      </div>
    </Modal>
  );
};
