import { Image } from "@/components/36S/ui/image";
import { SRC_DAMAGED_PICTURE, SRC_USER, VITE_BASE_QR_CODE } from "@/constants";
import { formatDate, formatDateTime } from "@/helpers";
import { useTag } from "@/services/hooks";
import { Input, Spin } from "antd";
import { FC } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "./not-found";

export const TagPage: FC = () => {
  const { useGetTag } = useTag();
  const { tag_no, tag_id } = useParams<{ tag_no: string; tag_id: string }>();

  const { isFetching, data } = useGetTag(tag_no ?? "", tag_id ?? "");

  if (isFetching) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <Spin size='large' tip='Loading profile...' />
      </div>
    );
  }

  if (!isFetching && (data?.tag_id ?? "") === "") {
    return <NotFoundPage />;
  }

  return (
    <div
      className={`w-screen h-screen flex justify-center md:items-center overflow-auto py-4 bg-slate-200`}>
      <div className=' w-min h-min p-4 rounded-md shadow-lg bg-white'>
        <div className=' flex-col md:flex-row flex gap-4'>
          <div className=' w-[24rem] h-full relative pb-4 px-6 border border-black pt-2'>
            <div className='w-full h-[5rem] overflow-hidden flex justify-between items-center'>
              <p className=' text-red-600 text-[3.8rem] font-bold text-logo'>
                IPC
              </p>

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
                      {data?.part?.customer_name}
                    </p>
                  </div>
                  <p className=' -mt-1'>Customer name</p>
                </div>
                <div className='w-[10rem]'>
                  <div className=' w-full flex text-nowrap gap-2'>
                    <p>วันที่</p>
                    <p className='w-full border-b border-black inline-block indent-2 font-bold'>
                      {formatDate(data?.printed_at ?? "")}
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

              <div className=' w-full h-[16rem] overflow-hidden flex items-center justify-center border border-black mt-1'>
                <Image
                  src={data?.part?.picture_std}
                  alt={data?.part?.part_no}
                  className=' w-full pt-9'
                />
              </div>
            </div>
            <div className=' absolute -bottom-[1px] text-[0.7rem] right-0 px-1 flex w-full'>
              <p>{data?.tag_no}</p>
              <p className=' w-full text-end'>
                FM-PRO-016 Rev.00 Effective Date : 19/01/13
              </p>
            </div>
          </div>
          <div className=' w-full md:w-[20rem] h-min grid gap-1 py-4 -mt-6 '>
            <div>
              <label className='text-right text-[0.8rem]'>
                Customer Name :
              </label>
              <Input
                id='customer_name'
                name='customer_name'
                value={data?.part?.customer_name || ""}
                placeholder='Enter customer name.'
                readOnly
              />
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>Part No :</label>
              <Input
                id='part_no'
                name='part_no'
                value={data?.part?.part_no || ""}
                placeholder='Enter part no.'
                readOnly
              />
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>Part Name :</label>
              <Input
                id='part_name'
                name='part_name'
                value={data?.part?.part_name || ""}
                placeholder='Enter part name.'
                readOnly
              />
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>Packing Std :</label>
              <Input
                id='packing_std'
                name='packing_std'
                type='number'
                value={data?.part?.packing_std || ""}
                placeholder='Enter packing std.'
                readOnly
              />
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>Printed By :</label>
              <div className=' flex gap-2 py-4 items-center font-medium h-[1rem]  '>
                <img
                  src={data?.printed_by?.profile_picture ?? ""}
                  alt='profile'
                  width='30'
                  height='30'
                  className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      data?.printed_by?.profile_picture ?? "" === ""
                        ? SRC_USER
                        : SRC_DAMAGED_PICTURE;
                  }}
                />
                <p>{data?.printed_by?.first_name}</p>
                <p>{data?.printed_by?.last_name}</p>
              </div>
            </div>
            {data?.checked_at && (
              <>
                <div>
                  <label className='text-right text-[0.8rem]'>
                    Chacked By :
                  </label>
                  <div className=' flex gap-2 py-4 items-center font-medium h-[1rem]  '>
                    <img
                      src={data?.checked_by?.profile_picture ?? ""}
                      alt='profile'
                      width='30'
                      height='30'
                      className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          data?.checked_by?.profile_picture ?? "" === ""
                            ? SRC_USER
                            : SRC_DAMAGED_PICTURE;
                      }}
                    />
                    <p>{data?.checked_by?.first_name ?? "-_-"}</p>
                    <p>{data?.checked_by?.last_name ?? ""}</p>
                  </div>
                </div>
                <div>
                  <label className='text-right text-[0.8rem]'>
                    Checked at :
                  </label>
                  <Input
                    id='packing_std'
                    name='packing_std'
                    type='number'
                    value={formatDateTime(data?.checked_at ?? "") || "-"}
                    placeholder='Enter Checked at.'
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
