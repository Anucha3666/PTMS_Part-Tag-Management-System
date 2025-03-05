import { formatDateTime } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TPrintingHistorys, TPrintTag } from "@/types";
import type { TableProps } from "antd";
import { Empty, Table } from "antd";
import { Eye } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PrintingHistorysDrawer } from "./printing-historys-drawer";

type TDataTable = TPrintingHistorys & { key: string };

export const PrintingHistorysTable: FC = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const { printingHistorys } = useAppSelector((state) => state.print);
  const [height, setHeight] = useState(0);
  const [dataPrintingHistorys, setDataPrintingHistorys] =
    useState<TPrintingHistorys>({} as TPrintingHistorys);

  const columns: TableProps<TDataTable>["columns"] = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      width: "18rem",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (data: TPrintTag[]) => (
        <>
          {data
            ?.map(
              (item) =>
                `[${item?.part_no}] ${item?.part_name} (${item?.no_tags})`
            )
            ?.join(", ")}
        </>
      ),
    },
    {
      title: "Printed By",
      dataIndex: "printed_by",
      key: "printed_by",
      width: "12rem",
      sorter: (a, b) => a.printed_by.localeCompare(b.printed_by),
    },
    {
      title: "Printed at",
      dataIndex: "create_at",
      key: "create_at",
      width: "12rem",
      sorter: (a, b) => a.create_at.localeCompare(b.create_at),
      render: (create_at) => formatDateTime(create_at),
    },

    {
      title: "Action",
      key: "index",
      width: "6rem",
      fixed: "right",
      render: (_, record: TPrintingHistorys) => (
        <div className='flex gap-2 cursor-pointer justify-center items-center'>
          <Eye
            className=' text-gray-400 hover:text-blue-600'
            onClick={() => {
              setDataPrintingHistorys(record as TPrintingHistorys);
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (divRef.current && height === 0) {
      setHeight(divRef.current.clientHeight);
    }
  }, [height]);

  return (
    <>
      <div ref={divRef} className=' w-full h-full overflow-hidden'>
        <div className='w-full h-min bg-white max-h-full rounded-md dark:shadow-md-dark'>
          <Table<TDataTable>
            columns={columns}
            dataSource={printingHistorys?.map((item) => ({
              ...item,
              key: item?._id,
            }))}
            className=' w-full !text-nowrap p-2'
            components={{
              header: {
                cell: (
                  props: React.HTMLAttributes<HTMLTableHeaderCellElement>
                ) => (
                  <th {...props}>
                    <p className=' w-full text-center'>{props.children}</p>
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
            scroll={{
              x: "max-content",
              y:
                printingHistorys?.length < 7
                  ? "max-content"
                  : `${height - 190}px`,
            }}
          />
        </div>
      </div>
      <PrintingHistorysDrawer
        data={dataPrintingHistorys}
        onClose={() => setDataPrintingHistorys({} as TPrintingHistorys)}
      />
    </>
  );
};
