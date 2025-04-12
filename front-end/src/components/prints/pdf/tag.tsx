"use client";

import { SRC_WHITE, VITE_BASE_QR_CODE } from "@/constants";
import { formatDate } from "@/helpers";
import { cn } from "@/libs/cn";
import { TPrintedTag, TPrintedTagSummary } from "@/types";
import { FC } from "react";
import QRCode from "react-qr-code";

export type TPDFTag = {
  data?: TPrintedTag;
  isView?: boolean;
  isViewPDF?: boolean;
};

type OutputData = {
  part_id: string;
  customer_name: string;
  part_no: string;
  part_name: string;
  packing_std: number;
  picture_std: string;
  tag_no: string;
  tag_id: string;
}[];

const PDFTag: FC<TPDFTag> = ({
  data = {} as TPrintedTag,
  isView = false,
  isViewPDF = false,
}) => {
  const transformData = (input: TPrintedTag): OutputData => {
    const result: OutputData = [];

    let tagIndex = 0;
    const summary = (input.summary ?? []) as TPrintedTagSummary[];
    for (const part of summary) {
      for (let i = 0; i < part.number_of_tags; i++) {
        result.push({
          part_id: part.part_id,
          customer_name: part.customer_name,
          part_no: part.part_no,
          part_name: part.part_name,
          packing_std: part.packing_std,
          picture_std: part.picture_std,
          tag_no: (input?.tags?.[tagIndex] ?? "")?.split("/")[0],
          tag_id: (input?.tags?.[tagIndex] ?? "")?.split("/")[1],
        });

        tagIndex++;
      }
    }

    return result;
  };

  const dataPrint = transformData(data);

  return (
    <div
      className={`${
        isView ? "scale-100 space-y-4 bg-[#525659] p-4" : "bg-white"
      } h-full w-full text-black`}>
      {Array?.from({ length: Math?.ceil(dataPrint?.length / 4) })?.map(
        (_, i) => (
          <div
            key={i}
            className={`w-full space-y-8 bg-white ${
              isView
                ? "!h-[297mm] !max-h-[297mm] !w-[210mm] !min-w-[210mm] !max-w-[210mm] p-2 shadow-2xl"
                : "page-break !h-[297mm] !max-h-[297mm] !w-[210mm] !min-w-[210mm] !max-w-[210mm] overflow-hidden"
            }`}>
            <div className='h-full w-full grid grid-cols-2 gap-2 grid-rows-2 justify-between '>
              {dataPrint?.slice(i * 4, i * 4 + 4)?.map((item, j) => (
                <div
                  key={j}
                  className=' w-full h-full relative px-6 pb-4 border border-black pt-2'>
                  <div className='w-full h-[5rem] overflow-hidden flex justify-between items-center'>
                    <p className=' text-red-600 text-[3.8rem] font-bold text-logo'>
                      IPC
                    </p>

                    <div className=' flex flex-col font-medium text-[0.8rem] items-center'>
                      <p className=' text-[1rem]'>ป้ายชี้บ่งระบุสถานภาพ</p>
                      <p className=' -mt-1'>Identification and status tag</p>
                    </div>

                    <QRCode
                      value={`${VITE_BASE_QR_CODE}/tag/${item?.tag_no}/${item?.tag_id}`}
                      className=' !w-[4.6rem] !h-[4.6rem]'
                    />
                  </div>
                  <div className='w-full h-full !text-[0.7rem]'>
                    <div className=' flex w-full gap-2'>
                      <div className='w-full'>
                        <div className=' w-full flex text-nowrap gap-2'>
                          <p>ชื่อผู้สั่งทำ</p>
                          <p className='w-full border-b border-black inline-block indent-2 font-bold '>
                            {item?.customer_name}
                          </p>
                        </div>
                        <p className=' -mt-1'>Customer name</p>
                      </div>
                      <div className='w-[10rem]'>
                        <div className=' w-full flex text-nowrap gap-2'>
                          <p>วันที่</p>
                          <p className='w-full border-b border-black inline-block indent-2 font-bold'>
                            {formatDate(new Date())}
                          </p>
                        </div>
                        <p className=' -mt-1'>Date</p>
                      </div>
                    </div>

                    <div className='w-full'>
                      <div className=' w-full flex text-nowrap gap-2'>
                        <p>ชื่อชิ้นงาน</p>
                        <p className='w-full border-b border-black inline-block indent-2 font-bold '>
                          {item?.part_name}
                        </p>
                      </div>
                      <p className=' -mt-1'>Part name</p>
                    </div>

                    <div className='w-full'>
                      <div className=' w-full flex text-nowrap gap-2'>
                        <p>เลขที่แบบ</p>
                        <p className='w-full border-b border-black inline-block indent-2 font-bold'>
                          {item?.part_no}
                        </p>
                      </div>
                      <p className=' -mt-1'>DWG No./Code</p>
                    </div>

                    <div className=' grid grid-cols-2 w-full gap-2'>
                      <div className='w-full'>
                        <div className=' w-full flex text-nowrap gap-2'>
                          <p>จำนวน</p>
                          <p className='w-full border-b border-black inline-block text-center font-bold'>
                            {item?.packing_std?.toLocaleString("en")}
                          </p>
                          <p>ชิ้น</p>
                        </div>
                        <p className=' -mt-1'>Quantity</p>
                      </div>
                      <div className='w-full'>
                        <div className=' w-full flex text-nowrap gap-2'>
                          <p>ขั้นตอน</p>
                          <p className='w-full border-b border-black inline-block'></p>
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

                    <div className='w-full'>
                      <div className=' w-full flex text-nowrap gap-2'>
                        <p>ใบสั่งงานเลขที่</p>
                        <p className='w-full border-b border-black inline-block indent-2 font-bold'></p>
                      </div>
                      <p className=' -mt-1'>Order No.</p>
                    </div>

                    <div
                      className={cn(
                        " w-full overflow-hidden flex items-center justify-center border border-black mt-1",
                        isViewPDF
                          ? "!h-[15.7rem] !max-h-[15.7rem]"
                          : isView
                          ? "!h-[16rem] !max-h-[16rem]"
                          : "!h-[16.58rem]"
                      )}>
                      <img
                        src={`${item?.picture_std}`}
                        alt={item?.part_no}
                        className=' w-full pt-9'
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = SRC_WHITE;
                        }}
                      />
                    </div>
                  </div>
                  <div className=' absolute -bottom-[1px] text-[0.7rem] right-0 px-1 flex w-full'>
                    <p>{item?.tag_no}</p>
                    <p className=' w-full text-end'>
                      FM-PRO-016 Rev.00 Effective Date : 19/01/13
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PDFTag;
