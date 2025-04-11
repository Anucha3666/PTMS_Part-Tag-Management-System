import PDFTag from "@/components/prints/pdf/tag";
import { TPrintedTag } from "@/types";
import { screenSize } from "@/utils";
import { Modal } from "antd";
import { FC } from "react";

export type TViewPDFPrintedModal = {
  data: TPrintedTag;
  onCancel: () => void;
};

export const ViewPDFPrintedModal: FC<TViewPDFPrintedModal> = ({
  data,
  onCancel,
}) => {
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
      <div className='w-full !h-[70svh] overflow-auto bg-[#525659]'>
        <div className='flex w-full rounded-md overflow-hidden flex-col space-y-2'>
          <PDFTag data={data} isView isViewPDF />
        </div>
      </div>
    </Modal>
  );
};
