import { WriteText } from "@/components/common";
import { useAppSelector } from "@/store/hook";
import { TProcess } from "@/types";
import { Empty, Table, TableProps, Tooltip } from "antd";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import {
  CreateUpdateProcessModal,
  DeleteProcessModal,
  ViewProcessModal,
} from "./modals";

export type TSettingsProcessesTableProps = {
  search?: string;
};

type TModal = TProcess & { order: "view" | "delete" | "create" | "update" };

export const SettingsProcessesTable: FC<TSettingsProcessesTableProps> = ({
  search,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { processes } = useAppSelector((store) => store?.process);

  const [height, setHeight] = useState(0);
  const [dataModal, setDataModal] = useState<TModal>({} as TModal);

  const columns: TableProps<TProcess>["columns"] = [
    {
      title: "Process name",
      dataIndex: "process_name",
      key: "process_name",
      sorter: (a, b) => a.process_name.localeCompare(b.process_name),
      render: (process_name) => <WriteText text={process_name ?? "-"} />,
    },
    {
      title: "Process description",
      dataIndex: "process_description",
      key: "process_description",
      sorter: (a, b) =>
        a.process_description.localeCompare(b.process_description),
      render: (process_description) => (
        <WriteText
          text={
            (process_description ?? "") === ""
              ? "-"
              : process_description ?? "-"
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
        <Table<TProcess>
          columns={columns}
          dataSource={processes?.filter((item) =>
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
        <ViewProcessModal
          data={dataModal}
          onCancel={() => setDataModal({} as TModal)}
        />
      )}
      {dataModal?.order === "delete" && (
        <DeleteProcessModal
          data={dataModal}
          onCancel={() => setDataModal({} as TModal)}
        />
      )}

      {(dataModal?.order === "create" || dataModal?.order === "update") && (
        <CreateUpdateProcessModal
          open={dataModal}
          onClose={() => setDataModal({} as TModal)}
        />
      )}
    </div>
  );
};
