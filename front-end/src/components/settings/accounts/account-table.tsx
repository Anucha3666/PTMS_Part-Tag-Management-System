import { TagRole, WriteText } from "@/components/common";
import { SRC_USER } from "@/constants";
import { useDisclosure } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TAccount } from "@/types";
import { Empty, Table, TableProps, Tooltip } from "antd";
import {
  CircleCheck,
  CirclePlus,
  CircleSlash,
  Eye,
  Trash2,
} from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import {
  ApproveAccountModal,
  ChangeRoleModal,
  CreateAccountModal,
  DeleteAccountModal,
  RejectAccountModal,
  ViewAccountModal,
} from ".";
import { ResetPasswordAccountModal } from "./modals/reset-password-account-modal";

export type TSettingsAccountTableProps = {
  search?: string;
};

export const SettingsAccountTable: FC<TSettingsAccountTableProps> = ({
  search,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { accounts } = useAppSelector((store) => store?.account);

  const [height, setHeight] = useState(0);
  const [dataView, setDataView] = useState<TAccount>({} as TAccount);
  const [dataDelete, setDataDelete] = useState<TAccount>({} as TAccount);
  const [dataResetPassword, setDataResetPassword] = useState<TAccount>(
    {} as TAccount
  );
  const [dataApprove, setDataApprove] = useState<TAccount>({} as TAccount);
  const [dataReject, setDataReject] = useState<TAccount>({} as TAccount);
  const [dataChangeRole, setDataChangeRole] = useState<TAccount>(
    {} as TAccount
  );

  const columns: TableProps<TAccount>["columns"] = [
    {
      title: "Profile Picture",
      dataIndex: "profile_picture",
      key: "profile_picture",
      width: "8rem",
      render: (profile_picture) => (
        <WriteText value={profile_picture}>
          <div className='w-full justify-center items-center flex'>
            <img
              src={profile_picture ?? ""}
              alt='profile'
              width='80'
              height='80'
              className='!max-w-[80px] !max-h-[80px] w-[80px] h-[80px] object-cover rounded-full border-[1px] my-4 shadow-md'
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = SRC_USER;
              }}
            />
          </div>
        </WriteText>
      ),
    },
    {
      title: "First name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      render: (first_name) => <WriteText text={first_name ?? "-"} />,
    },
    {
      title: "Last name",
      dataIndex: "last_name",
      key: "last_name",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      render: (last_name) => <WriteText text={last_name ?? "-"} />,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
      render: (position) => <WriteText text={position ?? "-"} />,
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      width: "8rem",
      sorter: (a, b) => (a.role ?? "").localeCompare(b.role ?? ""),
      render: (role, record) =>
        record?.is_deleted ? (
          <Tooltip title={<p>Role</p>}>
            <TagRole isDlelete role={role} />
          </Tooltip>
        ) : (
          <Tooltip title={<p>Change Role</p>}>
            <div
              className='w-full cursor-pointer'
              onClick={() => setDataChangeRole(record)}>
              <TagRole role={role} />
            </div>
          </Tooltip>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: "5rem",
      fixed: "right",
      render: (_, record) => {
        return (
          <div className='flex justify-center  items-center gap-2 relative'>
            <Tooltip title={<p>View Account</p>}>
              <Eye
                className='text-gray-400 hover:text-blue-600 cursor-pointer'
                onClick={() => setDataView(record)}
              />
            </Tooltip>
            {!record?.is_approved && (record?.approved_by ?? "") === "" ? (
              <>
                <Tooltip title={<p>Approve Account</p>}>
                  <CircleCheck
                    className='text-gray-400 hover:text-green-600 cursor-pointer'
                    onClick={() => setDataApprove(record)}
                  />
                </Tooltip>
                <Tooltip title={<p>Reject Account</p>}>
                  <CircleSlash
                    className='text-gray-400 hover:text-red-600 cursor-pointer'
                    onClick={() => setDataReject(record)}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                {record?.is_forgot_password && (
                  <Tooltip title={<p>Reset Password</p>}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      stroke-width='2'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      className='text-gray-400 hover:text-purple-600 cursor-pointer'
                      onClick={() => setDataResetPassword(record)}>
                      <path d='m14.5 9.5 1 1' />
                      <path d='m15.5 8.5-4 4' />
                      <path d='M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8' />
                      <path d='M3 3v5h5' />
                      <circle cx='10' cy='14' r='2' />
                    </svg>
                  </Tooltip>
                )}

                {!record?.is_deleted && (
                  <Tooltip title={<p>Delete Account</p>}>
                    <Trash2
                      className='text-gray-400 hover:text-red-600 cursor-pointer'
                      onClick={() => setDataDelete(record)}
                    />
                  </Tooltip>
                )}
              </>
            )}

            {record?.is_deleted && (
              <p className=' text-xl font-bold absolute text-[#FF000030] rotate-12 -z-10 '>
                Deleted
              </p>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.clientHeight);
    }
  }, []);

  return (
    <div ref={divRef} className=' w-full h-full  overflow-hidden'>
      <div className='w-full h-min bg-white max-h-full rounded-md  '>
        <Table<TAccount>
          columns={columns}
          dataSource={accounts?.filter((item) =>
            search
              ? Object.values(item)
                  .join(" ")
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : true
          )}
          className='w-full !text-nowrap h-min max-h-full !rounded-none'
          components={{
            header: {
              cell: (
                props: React.HTMLAttributes<HTMLTableHeaderCellElement>
              ) => (
                <th
                  {...props}
                  style={{
                    textAlign: "center",
                  }}>
                  {props.children}
                </th>
              ),
            },
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty?.PRESENTED_IMAGE_DEFAULT}
                description='No data available'
                style={{
                  padding: "40px",
                }}
              />
            ),
          }}
          footer={() => (
            <div className='w-full flex justify-end bg-white border-b-[1px] p-4'>
              <CirclePlus
                className=' text-gray-400 hover:text-green-600 cursor-pointer'
                onClick={onOpen}
              />
            </div>
          )}
          scroll={
            search === undefined
              ? { x: "max-content" }
              : { x: "max-content", y: `${height - 235}px` }
          }
        />
      </div>

      <DeleteAccountModal
        data={dataDelete}
        onCancel={() => setDataDelete({} as TAccount)}
      />
      <ResetPasswordAccountModal
        data={dataResetPassword}
        onCancel={() => setDataResetPassword({} as TAccount)}
      />
      <ApproveAccountModal
        data={dataApprove}
        onCancel={() => setDataApprove({} as TAccount)}
      />
      <RejectAccountModal
        data={dataReject}
        onCancel={() => setDataReject({} as TAccount)}
      />
      <ChangeRoleModal
        data={dataChangeRole}
        onCancel={() => setDataChangeRole({} as TAccount)}
      />

      {isOpen && <CreateAccountModal open onClose={onClose} />}
      {(dataView?.account_id ?? "") !== "" && (
        <ViewAccountModal
          open={dataView}
          onClose={() => setDataView({} as TAccount)}
        />
      )}
    </div>
  );
};
