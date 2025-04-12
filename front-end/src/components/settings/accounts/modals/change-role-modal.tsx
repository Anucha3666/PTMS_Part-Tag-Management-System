import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/36S/ui";
import { TagRole } from "@/components/common";
import { SRC_DAMAGED_PICTURE, SRC_USER } from "@/constants";
import { useAccount } from "@/services/hooks";
import { TAccount, TRole } from "@/types";
import { screenSize } from "@/utils";
import { Button, Modal } from "antd";
import { FC, useEffect, useState } from "react";

export type TChangeRoleModal = {
  data: TAccount;
  onCancel: () => void;
};

export const ChangeRoleModal: FC<TChangeRoleModal> = ({ data, onCancel }) => {
  const { mutateChangeRole } = useAccount();

  const [role, setRole] = useState<TRole>(data?.role);

  useEffect(() => setRole(data?.role), [data?.role]);

  return (
    <Modal
      title={"Change Role"}
      open={(data?.account_id ?? "") !== ""}
      okText={"Confirm"}
      onCancel={() => {
        if (onCancel) {
          onCancel();
        }
      }}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key='delete'
          type='primary'
          onClick={() => {
            mutateChangeRole({ account_id: data?.account_id, role: role });
            onCancel();
          }}>
          Confirm
        </Button>,
      ]}
      width={
        screenSize().size === "base" || screenSize().size === "sm"
          ? "95%"
          : "max-content"
      }>
      <div className='flex gap-4 justify-center items-center w-full'>
        <img
          src={data?.profile_picture ?? ""}
          alt='profile'
          width='40'
          height='40'
          className='!max-w-[40px] !max-h-[40px] w-[40px] h-[40px] object-cover rounded-full border-[1px] my-4 shadow-md'
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              data?.profile_picture ?? "" === ""
                ? SRC_USER
                : SRC_DAMAGED_PICTURE;
          }}
        />

        <div className=' font-bold flex flex-col  text-lg text-slate-400 h-ful'>
          <div className=' flex gap-2 items-center justify-center text-black'>
            <p className='text-xl'>
              {data?.first_name} {data?.last_name}
            </p>
          </div>
          <p>{data?.position}</p>
          <p>{data?.employee_number}</p>
        </div>
      </div>
      <div className='w-full flex justify-center pb-2 items-center'>
        <MenuRoot className=' w-[8rem] z-40'>
          <MenuTrigger className=' w-full'>
            <TagRole role={role} />
          </MenuTrigger>
          <MenuContent>
            {["viewer", "user", "admin", "owner", ""]
              ?.filter((info) => info !== role)
              ?.map((item, i) => (
                <MenuItem key={i} onClick={() => setRole(item as TRole)}>
                  {item === "" ? "BLOCK" : item?.toLocaleUpperCase()}
                </MenuItem>
              ))}
          </MenuContent>
        </MenuRoot>
      </div>
      <p className=' w-full text-center'>
        --- Please press "Confirm" to change role. ---
      </p>
    </Modal>
  );
};
