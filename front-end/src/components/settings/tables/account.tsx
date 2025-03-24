import { MenuContent, MenuRoot, MenuTrigger } from "@/components/36S/ui";
import { TagRole, WriteText } from "@/components/common";
import { getCustomTableDarkThemeProps } from "@/helpers";
import { TAccount } from "@/types";
import { Empty, Table, TableProps } from "antd";
import MenuItem from "antd/es/menu/MenuItem";
import { CirclePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const AccountTable = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const { className, rowClassName, rootClassName } =
    getCustomTableDarkThemeProps();

  const [height, setHeight] = useState(0);
  const columns: TableProps<TAccount>["columns"] = [
    {
      title: "Profile Picture",
      dataIndex: "profile_picture",
      key: "profile_picture",
      render: (profile_picture) => <WriteText text={profile_picture} />,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (username) => <WriteText text={username} />,
    },
    {
      title: "First name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      render: (first_name) => <WriteText text={first_name} />,
    },
    {
      title: "Last name",
      dataIndex: "last_name",
      key: "last_name",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      render: (last_name) => <WriteText text={last_name} />,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
      render: (position) => <WriteText text={position} />,
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      width: "8rem",
      sorter: (a, b) => (a.role ?? "").localeCompare(b.role ?? ""),
      render: (role) => (
        <MenuRoot className=' w-full'>
          <MenuTrigger className=' w-full'>
            <TagRole role={role} />
          </MenuTrigger>
          <MenuContent>
            {["admin", "user", "block"]
              ?.filter((info) => info !== role)
              ?.map((item, i) => (
                <MenuItem key={i} onClick={() => {}}>
                  {item?.toLocaleUpperCase()}
                </MenuItem>
              ))}
          </MenuContent>
        </MenuRoot>
      ),
    },
  ];

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.clientHeight);
    }
  }, []);

  return (
    <div
      ref={divRef}
      className=' w-full h-full  overflow-hidden bg-[#F1F1F1] dark:bg-[#101010]'>
      <div className='w-full h-min bg-white max-h-full rounded-md dark:shadow-md-dark'>
        <Table<TAccount>
          columns={columns}
          className={className}
          rowClassName={rowClassName}
          rootClassName={rootClassName}
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
            <div className='w-full flex justify-end bg-white border-b-[1px] dark:border-[#303030] dark:bg-[#0B1739] p-4'>
              <CirclePlus
                className=' text-gray-400 hover:text-green-600 cursor-pointer'
                onClick={() => {}}
              />
            </div>
          )}
          scroll={{ x: "max-content", y: `${height - 175}px` }}
        />
      </div>
    </div>
  );
};
