import { Image } from "@/components/36S/ui/image";
import { WriteText } from "@/components/common";
import { useAppSelector } from "@/store/hook";
import { TCustomer } from "@/types";
import { Empty, Table, TableProps, Tooltip } from "antd";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import {
  CreateUpdateCustomerModal,
  DeleteCustomerModal,
  ViewCustomerModal,
} from "./modals";

export type TSettingsCustomerTableProps = {
  search?: string;
};

type TModal = TCustomer & { order: "view" | "delete" | "create" | "update" };

export const SettingsCustomerTable: FC<TSettingsCustomerTableProps> = ({
  search,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { customers } = useAppSelector((store) => store?.customer);

  const [height, setHeight] = useState(0);
  const [dataModal, setDataModal] = useState<TModal>({} as TModal);

  const columns: TableProps<TCustomer>["columns"] = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: "8rem",
      render: (logo) => (
        <WriteText value={logo}>
          <div className='w-full justify-center items-center flex'>
            <Image
              src={logo ?? ""}
              alt='profile'
              className='!max-w-[80px] !max-h-[80px] w-[80px] h-[80px] object-cover rounded-full border-[1px] my-4 shadow-md'
            />
          </div>
        </WriteText>
      ),
    },
    {
      title: "Customer name",
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
      render: (customer_name) => <WriteText text={customer_name ?? "-"} />,
    },
    {
      title: "Customer description",
      dataIndex: "customer_description",
      key: "customer_description",
      sorter: (a, b) =>
        a.customer_description.localeCompare(b.customer_description),
      render: (customer_description) => (
        <WriteText
          text={
            (customer_description ?? "") === ""
              ? "-"
              : customer_description ?? "-"
          }
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "5rem",
      fixed: "right",
      render: (_, record) => {
        return (
          <div className='flex justify-center w-full h-full relative items-center gap-2'>
            <Tooltip title={<p>View more</p>}>
              <Eye
                className='text-gray-400 hover:text-blue-600 cursor-pointer'
                onClick={() => setDataModal({ ...record, order: "view" })}
              />
            </Tooltip>
            {!record?.is_deleted && (
              <>
                <Tooltip title={<p>Edit customer</p>}>
                  <Pencil
                    className='text-gray-400 hover:text-blue-600 cursor-pointer'
                    onClick={() => setDataModal({ ...record, order: "update" })}
                  />
                </Tooltip>
                <Tooltip title={<p>Delete customer</p>}>
                  <Trash2
                    className='text-gray-400 hover:text-red-600 cursor-pointer'
                    onClick={() => setDataModal({ ...record, order: "delete" })}
                  />
                </Tooltip>
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
        <Table<TCustomer>
          columns={columns}
          dataSource={customers?.filter((item) =>
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
                onClick={() => setDataModal({ order: "create" } as TModal)}
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
      {dataModal?.order === "view" && (
        <ViewCustomerModal
          data={dataModal}
          onCancel={() => setDataModal({} as TModal)}
        />
      )}
      {dataModal?.order === "delete" && (
        <DeleteCustomerModal
          data={dataModal}
          onCancel={() => setDataModal({} as TModal)}
        />
      )}

      {(dataModal?.order === "create" || dataModal?.order === "update") && (
        <CreateUpdateCustomerModal
          open={dataModal}
          onClose={() => setDataModal({} as TModal)}
        />
      )}
    </div>
  );
};
