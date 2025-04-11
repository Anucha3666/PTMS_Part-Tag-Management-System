import { TPrintingHistorys } from "@/types";
import { Drawer } from "antd";
import { FC } from "react";
import PDFTag from "../prints/pdf/tag";

export type TPrintingHistorysDrawer = {
  open?: boolean;
  data?: TPrintingHistorys;
  onConfirm?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
};

export const PrintingHistorysDrawer: FC<TPrintingHistorysDrawer> = ({
  open = false,
  onClose,
  data = {} as TPrintingHistorys,
}) => {
  return (
    <Drawer
      title='Print Tags'
      width={"230mm"}
      open={open || data?.data?.length > 0}
      onClose={onClose}>
      <div className=' flex flex-col gap-2 w-full h-full overflow-hidden'>
        <div className=' w-full h-full overflow-auto'>
          <div className='flex w-full rounded-md overflow-hidden flex-col space-y-2'>
            <PDFTag data={data} />
          </div>
        </div>
      </div>
    </Drawer>
  );
};
