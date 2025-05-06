import { SRC_WHITE, VITE_BASE_QR_CODE } from "@/constants";
import { formatDate } from "@/helpers";
import { cn } from "@/libs/cn";
import { TTag } from "@/types";
import { screenSize } from "@/utils";
import { Modal } from "antd";
import { FC } from "react";
import QRCode from "react-qr-code";

export type TViewTagModal = {
  data: TTag;
  onCancel: () => void;
};

export const ViewTagModal: FC<TViewTagModal> = ({ data, onCancel }) => {
  return (
    <Modal
      title={"View tag"}
      open={(data?.tag_id ?? "") !== ""}
      onCancel={() => {
        if (onCancel) {
          onCancel();
        }
      }}
      footer={null}
      width={
        screenSize().size === "base" || screenSize().size === "sm"
          ? "95%"
          : "27rem"
      }>
      {" "}
      <div className=' w-[24rem] h-full relative pb-4 px-6 border border-black pt-2'>
        <div className='w-full h-[5rem] overflow-hidden flex justify-between items-center'>
          <p className=' text-red-600 text-[3.8rem] font-bold text-logo'>IPC</p>

          <div className=' flex flex-col font-medium text-[0.8rem] items-center'>
            <p className=' text-[1rem]'>ป้ายชี้บ่งระบุสถานภาพ</p>
            <p className=' -mt-1'>Identification and status tag</p>
          </div>

          <QRCode
            value={`${VITE_BASE_QR_CODE}/tag/${data?.tag_no}/${data?.tag_id}`}
            className=' w-[4.6rem] h-min'
          />
        </div>
        <div className='w-full h-full !text-[0.7rem]'>
          <div className=' flex w-full gap-2'>
            <div className='w-full'>
              <div className=' w-full flex text-nowrap gap-2'>
                <p>ชื่อผู้สั่งทำ</p>
                <p className='w-full border-b border-black inline-block indent-2 font-bold '>
                  {data?.customer_name}
                </p>
              </div>
              <p className=' -mt-1'>Customer name</p>
            </div>
            <div className='w-[12rem] overflow-hidden'>
              <div className=' w-full flex text-nowrap gap-2'>
                <p>วันที่</p>
                <p className='w-full border-b border-black inline-block indent-2 font-bold'>
                  {formatDate(data?.printed_at)}
                </p>
              </div>
              <p className=' -mt-1'>Date</p>
            </div>
          </div>

          <div className='w-full'>
            <div className=' w-full flex text-nowrap gap-2'>
              <p>ชื่อชิ้นงาน</p>
              <p className='w-full border-b border-black inline-block indent-2 font-bold '>
                {data?.part?.part_name}
              </p>
            </div>
            <p className=' -mt-1'>Part name</p>
          </div>

          <div className='w-full'>
            <div className=' w-full flex text-nowrap gap-2'>
              <p>เลขที่แบบ</p>
              <p className='w-full border-b border-black inline-block indent-2 font-bold'>
                {data?.part?.part_no}
              </p>
            </div>
            <p className=' -mt-1'>DWG No./Code</p>
          </div>

          <div className=' grid grid-cols-2 w-full gap-2'>
            <div className='w-full'>
              <div className=' w-full flex text-nowrap gap-2'>
                <p>จำนวน</p>
                <p className='w-full border-b border-black inline-block text-center font-bold'>
                  {data?.part?.packing_std?.toLocaleString("en")}
                </p>
                <p>ชิ้น</p>
              </div>
              <p className=' -mt-1'>Quantity</p>
            </div>
            <div className='w-full'>
              <div className=' w-full flex text-nowrap gap-2'>
                <p>ขั้นตอน</p>
                <p className='w-full border-b border-black inline-block indent-2 font-bold'>
                  {data?.process}
                </p>{" "}
              </div>
              <p className=' -mt-1'>Process</p>
            </div>
          </div>

          <div className=' grid grid-cols-2 w-full gap-2'>
            <div className='w-full'>
              <div className=' w-full flex text-nowrap gap-2'>
                <p>ผู้มอบงาน</p>
                <p className='w-full border-b border-black inline-block'></p>
              </div>
              <p className=' -mt-1'>Delivery by</p>
            </div>
            <div className='w-full'>
              <div className=' w-full flex text-nowrap gap-2'>
                <p>แผนก</p>
                <p className='w-full border-b border-black inline-block'></p>
              </div>
              <p className=' -mt-1'>Section</p>
            </div>
          </div>

          <div className='w-full relative'>
            <div className=' w-full flex text-nowrap gap-2'>
              <p>ใบสั่งงานเลขที่</p>
              <p className='w-full border-b border-black inline-block indent-2 font-bold'></p>
            </div>
            <p className=' -mt-1'>Order No.</p>

            <div className=' absolute right-0 top-1 pl-2 bg-white'>
              <p className=' border-[1px] border-black  rounded-sm px-1'>
                RoHS II
              </p>
            </div>
          </div>

          <div
            className={cn(
              " w-full overflow-hidden flex items-center justify-center border border-black mt-1",
              "!h-[15.7rem] !max-h-[15.7rem]"
            )}>
            <img
              src={`${data?.part?.picture_std}`}
              alt={data?.part?.part_no}
              className=' w-full pt-9'
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = SRC_WHITE;
              }}
            />
          </div>
        </div>
        <div className=' absolute -bottom-[1px] text-[0.7rem] right-0 px-1 flex w-full'>
          <p>{data?.tag_no}</p>{" "}
          <p className=' w-full text-end'>
            FM-PRO-016 Rev.00 Effective Date : 19/01/13
          </p>
        </div>
      </div>
    </Modal>
  );
};
