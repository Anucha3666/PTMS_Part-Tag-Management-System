import { Image } from "@/components/36S/ui/image";
import { SRC_USER, VITE_BASE_QR_CODE } from "@/constants";
import { formatDate, formatDateTime } from "@/helpers";
import { useTag } from "@/services/hooks";
import { useAppSelector } from "@/store/hook";
import { TValidationTag } from "@/types";
import { Input, InputRef, Spin } from "antd";
import { Delete } from "lucide-react";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";

export const ComparisonPage = () => {
  const qrCodeTagInputRef = useRef<InputRef>(null);
  const refTagInputRef = useRef<InputRef>(null);
  const { useGetTag, mutateValidationTag } = useTag();

  const { tags } = useAppSelector((state) => state?.tag);
  const [validationTag, setValidationTag] = useState<TValidationTag>({
    type: "daikin",
  } as TValidationTag);

  const tag_id = tags?.find(
    ({ tag_no }) => tag_no === validationTag?.tag_no
  )?.tag_id;

  const { isFetching, data } = useGetTag(
    validationTag?.tag_no ?? "",
    tag_id ?? ""
  );

  return (
    <div className='p-2 w-full h-full flex flex-col gap-2 overflow-hidden'>
      <div className='w-full rounded-md h-min bg-white max-h-full flex p-2 flex-col overflow-hidden '>
        <div className=' w-full flex justify-between items-center h-min bg-white'>
          <p className=' text-lg font-bold'>Comparison</p>
        </div>
        <div className=' w-full h-min overflow-hidden grid gap-2 grid-cols-3'>
          <div className='w-full  h-min '>
            <div>
              <label className='text-right text-[0.8rem]'>QR Tag PTMS :</label>
              <div className='w-full relative'>
                <Input
                  ref={qrCodeTagInputRef}
                  id='tag_no'
                  name='tag_no'
                  value={validationTag?.tag_no}
                  placeholder='Enter qr tag ptms.'
                  onChange={(e) => {
                    setValidationTag({
                      ...validationTag,
                      tag_no: e?.target?.value ?? "",
                    });

                    if (
                      (e.target?.value?.length ?? 0) >
                      validationTag?.tag_no?.length + 1
                    )
                      refTagInputRef.current?.focus();
                  }}
                />
                <Delete
                  className=' text-gray-400 hover:text-red-500 hover:scale-105 active:scale-95 absolute top-1 right-2'
                  onClick={() => {
                    setValidationTag({
                      ...validationTag,
                      tag_no: "",
                    });
                    qrCodeTagInputRef.current?.focus();
                  }}
                />
              </div>
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>REF. Tag:</label>
              <Input
                id='ref_tag'
                name='ref_tag'
                ref={refTagInputRef}
                value={""}
                placeholder='Enter ref tag.'
                onChange={async (e) => {
                  const res = await mutateValidationTag({
                    ...validationTag,
                    ref_tag: e?.target?.value ?? "",
                  });

                  if (res?.status === "success") {
                    setTimeout(() => {
                      setValidationTag({ type: "daikin" } as TValidationTag);
                      qrCodeTagInputRef.current?.focus();
                    }, 1000);
                  }
                }}
              />
            </div>
          </div>
          <div className=' col-span-2 w-full h-full overflow-hidden pb-2'>
            <p>Preview Tag</p>
            <div className='border-[1px] w-full rounded-md shadow-md h-min p-2'>
              {(data?.tag_id ?? "") === "" || isFetching ? (
                <div className=' w-full h-[4.2rem] overflow-hidden justify-center items-center flex'>
                  <Spin size='large' tip='Loading profile...' />
                </div>
              ) : (
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
                              {data?.customer_name}
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
                        Customer :
                      </label>
                      <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
                        <Image
                          src={data?.part?.customer?.logo ?? ""}
                          alt='customer_logio'
                          className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
                        />

                        <p>{data?.part?.customer?.customer_name}</p>
                      </div>
                    </div>
                    <div>
                      <label className='text-right text-[0.8rem]'>
                        Part No :
                      </label>
                      <Input
                        id='part_no'
                        name='part_no'
                        value={data?.part?.part_no || ""}
                        placeholder='Enter part no.'
                        readOnly
                      />
                    </div>
                    <div>
                      <label className='text-right text-[0.8rem]'>
                        Part Name :
                      </label>
                      <Input
                        id='part_name'
                        name='part_name'
                        value={data?.part?.part_name || ""}
                        placeholder='Enter part name.'
                        readOnly
                      />
                    </div>
                    <div>
                      <label className='text-right text-[0.8rem]'>
                        Packing Std :
                      </label>
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
                      <label className='text-right text-[0.8rem]'>
                        Printed By :
                      </label>
                      <div className=' flex gap-2 py-4 items-center font-medium h-[1rem]  '>
                        <Image
                          src={data?.printed_by?.profile_picture ?? ""}
                          srcErrorNoPicture={SRC_USER}
                          alt='profile'
                          className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
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
                            <Image
                              src={data?.checked_by?.profile_picture ?? ""}
                              srcErrorNoPicture={SRC_USER}
                              alt='profile'
                              className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
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
                            id='checked_at'
                            name='checked_at'
                            value={
                              formatDateTime(data?.checked_at ?? "") || "-"
                            }
                            placeholder='Enter Checked at.'
                            readOnly
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
