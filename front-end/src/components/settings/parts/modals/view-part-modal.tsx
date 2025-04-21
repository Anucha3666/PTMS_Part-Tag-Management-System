import { Image } from "@/components/36S/ui/image";
import { UploadImage } from "@/components/common";
import { SRC_DAMAGED_PICTURE, SRC_USER } from "@/constants";
import { formatDateTime } from "@/helpers";
import { usePart } from "@/services/hooks";
import { useAppSelector } from "@/store/hook";
import { TPart, TPartChangeHistory } from "@/types";
import { Input, Modal } from "antd";
import { FC, Fragment } from "react";

type TDataModalPart = TPart & {
  order: "view" | "update" | "delete" | "create" | "change-historys";
};

export type TViewPartModal = {
  open: TDataModalPart;
  onClose: () => void;
};

export const ViewPartModal: FC<TViewPartModal> = ({ open, onClose }) => {
  const { useGetPartChangeHistorys } = usePart();
  const { accounts } = useAppSelector((state) => state?.account);

  const { data } = useGetPartChangeHistorys(open?.part_id);

  const dataPartChangeHistorys = (data ?? []) as TPartChangeHistory[];

  const dataCreated =
    dataPartChangeHistorys[(dataPartChangeHistorys?.length ?? 1) - 1];

  const Created = accounts?.find(
    ({ account_id }) => account_id === dataCreated?.created_by
  );

  const Updater = accounts?.find(
    ({ account_id }) => account_id === open?.created_by
  );

  const Deleter = accounts?.find(
    ({ account_id }) => account_id === open?.deleted_by
  );

  return (
    <Modal
      title={"View Part"}
      open={open?.order === "view"}
      onCancel={onClose}
      width={"44rem"}
      footer={<></>}>
      <div className='w-full flex flex-col gap-4'>
        <div className='grid gap-2 grid-cols-2 w-full'>
          <div>
            <label className='text-right text-[0.8rem]'>Customer :</label>
            <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
              <Image
                src={open?.customer?.logo ?? ""}
                alt='customer_logio'
                className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
              />

              <p>{open?.customer?.customer_name}</p>
            </div>
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>Part No :</label>
            <Input
              id='part_no'
              name='part_no'
              value={open.part_no || ""}
              placeholder='Enter part no.'
              readOnly
            />
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>Part Name :</label>
            <Input
              id='part_name'
              name='part_name'
              value={open.part_name || ""}
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
              value={open.packing_std || ""}
              placeholder='Enter packing std.'
              readOnly
            />
          </div>
          <div className='flex gap-2 justify-between'>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] overflow-hidden text-nowrap w-full'>
                Picture Std :
              </label>
              <UploadImage src={open?.picture_std ?? ""} disabled />
            </div>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] text-nowrap'>
                Q-Point :
              </label>
              <UploadImage src={open?.q_point ?? ""} disabled />
            </div>
            <div className='justify-between items-center'>
              <label className='text-right text-[0.8rem] text-nowrap'>
                Packing :
              </label>
              <UploadImage src={open?.packing ?? ""} disabled />
            </div>
          </div>
          <div className=' flex flex-col gap-1 items-start'>
            <label className='text-right text-[0.8rem] text-nowrap'>
              More pictures ({open?.more_pictures?.length ?? 0}/3) :
            </label>
            <div className=' flex gap-2'>
              {(open?.more_pictures?.length === 0
                ? []
                : open?.more_pictures
              )?.map((src, i) => (
                <Fragment key={i}>
                  <UploadImage src={src ?? ""} disabled />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className='grid gap-2 grid-cols-2 w-full border-t-2'>
          <div>
            <label className='text-right text-[0.8rem]'>Creator :</label>
            <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
              <Image
                src={Created?.profile_picture ?? ""}
                srcErrorNoPicture={SRC_USER}
                alt='profile'
                className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
              />
              <p>{Created?.first_name}</p>
              <p>{Created?.last_name}</p>
            </div>
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>Create At :</label>
            <Input
              id='create_at'
              name='create_at'
              value={formatDateTime(dataCreated?.created_at) ?? "-"}
              readOnly
            />
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>Latest Updater :</label>
            <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
              <Image
                src={Updater?.profile_picture ?? ""}
                srcErrorNoPicture={SRC_USER}
                alt='profile'
                className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
              />
              <p>{Updater?.first_name}</p>
              <p>{Updater?.last_name}</p>
            </div>
          </div>
          <div>
            <label className='text-right text-[0.8rem]'>
              Latest Updated At :
            </label>
            <Input
              id='update_at'
              name='update_at'
              value={formatDateTime(open.created_at) ?? "-"}
              readOnly
            />
          </div>
        </div>
        {open?.is_deleted && (
          <div className='grid gap-2 grid-cols-2 w-full border-t-2'>
            <div>
              <label className='text-right text-[0.8rem]'>Deleter :</label>
              <div className=' flex gap-2 pt-4 items-center font-medium h-[1rem]  '>
                <img
                  src={Deleter?.profile_picture ?? ""}
                  alt='profile'
                  width='30'
                  height='30'
                  className='!max-w-[30px] !max-h-[30px] w-[30px] h-[30px] object-cover rounded-full border-[1px] my-4 shadow-md'
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      Deleter?.profile_picture ?? "" === ""
                        ? SRC_USER
                        : SRC_DAMAGED_PICTURE;
                  }}
                />
                <p>{Deleter?.first_name}</p>
                <p>{Deleter?.last_name}</p>
              </div>
            </div>
            <div>
              <label className='text-right text-[0.8rem]'>Deleted At :</label>
              <Input
                id='deleted_at'
                name='deleted_at'
                value={formatDateTime(open?.deleted_at ?? "") ?? "-"}
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
