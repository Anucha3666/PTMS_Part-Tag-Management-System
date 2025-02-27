"use client";

import { useAppSelector } from "@/store/hook";
import { FC } from "react";
import QRCode from "react-qr-code";

const PDFTag: FC = () => {
  const isView = true;
  const { printTags } = useAppSelector((state) => state.printTags);

  const data = printTags?.flatMap((item) =>
    Array.from({ length: item?.no_tags }, () => ({ ...item }))
  );

  return (
    <div
      className={`${
        isView ? "scale-100 space-y-4 bg-[#525659] p-4" : "bg-white"
      } h-full w-full text-black`}>
      {Array?.from({ length: Math?.ceil(data?.length / 6) })?.map((_, i) => (
        <div
          key={i}
          className={`w-full space-y-8 bg-white ${
            isView
              ? "h-[297mm] w-[210mm] min-w-[210mm] p-2 shadow-2xl"
              : "page-break h-full"
          }`}>
          <div className='h-full w-full grid grid-cols-2 gap-2 grid-rows-3 justify-between '>
            {data?.slice(i * 6, i * 6 + 6)?.map((item, j) => (
              <div
                key={j}
                className=' w-full h-full relative px-6 border border-black pt-2'>
                <div className='w-full h-[5rem] overflow-hidden flex justify-between items-center'>
                  <p className=' text-red-600 text-[3.8rem] font-bold text-logo'>
                    IPC
                  </p>

                  <div className=' flex flex-col font-medium text-[0.8rem] items-center'>
                    <p className=' text-[1rem]'>ป้ายชี้บ่งระบุสถานภาพ</p>
                    <p className=' -mt-1'>Identification and status tag</p>
                  </div>

                  <QRCode
                    value={`A${(i * 6 + j + 1).toString().padStart(4, "0")}`}
                    className=' w-[4.6rem] h-min'
                  />
                </div>
                <div className='w-full h-full !text-[0.7rem]'>
                  <div className=' flex w-full gap-2'>
                    <div className='w-full'>
                      <div className=' w-full flex text-nowrap gap-2'>
                        <p>ชื่อผู้สั่งทำ</p>
                        <p className='w-full border-b border-black inline-block'></p>
                      </div>
                      <p className=' -mt-1'>Customer name</p>
                    </div>
                    <div className='w-[10rem]'>
                      <div className=' w-full flex text-nowrap gap-2'>
                        <p>วันที่</p>
                        <p className='w-full border-b border-black inline-block'></p>
                      </div>
                      <p className=' -mt-1'>Date</p>
                    </div>
                  </div>

                  <div className='w-full'>
                    <div className=' w-full flex text-nowrap gap-2'>
                      <p>ชื่อชิ้นงาน</p>
                      <p className='w-full border-b border-black inline-block'>
                        {item?.part_name}
                      </p>
                    </div>
                    <p className=' -mt-1'>Part name</p>
                  </div>

                  <div className='w-full'>
                    <div className=' w-full flex text-nowrap gap-2'>
                      <p>เลขที่แบบ</p>
                      <p className='w-full border-b border-black inline-block'>
                        {item?.part_no}
                      </p>
                    </div>
                    <p className=' -mt-1'>DWG No./Code</p>
                  </div>

                  <div className=' grid grid-cols-2 w-full gap-2'>
                    <div className='w-full'>
                      <div className=' w-full flex text-nowrap gap-2'>
                        <p>จำนวน</p>
                        <p className='w-full border-b border-black inline-block'>
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

                  <div className=' w-full h-[6.5rem] overflow-hidden flex items-center justify-center border border-black mt-1'>
                    <img
                      src={item?.picture_std}
                      alt={item?.part_no}
                      className=' w-full pt-9'
                    />
                  </div>
                </div>
                <div className=' absolute bottom-0 text-[0.7rem] right-0 px-2 flex w-full'>
                  <p>A{(i * 6 + j + 1).toString().padStart(4, "0")}</p>
                  <p className=' w-full text-end'>
                    FM-PRO-016 Rev.00 Effective Date : 19/01/13
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PDFTag;
