import { Empty, Table } from "antd";
import type { TableProps } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoView } from "react-photo-view";
import { PhotoProvider } from "react-photo-view";

interface DataType {
  key: string;
  part_no: string;
  part_name: string;
  packing_standard: number;
}

export const PrintTable: FC = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(0);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Part No.",
      dataIndex: "part_no",
      key: "part_no",
      width: "18rem",
      sorter: (a, b) => a.part_no.localeCompare(b.part_no),
    },
    {
      title: "Part Name",
      dataIndex: "part_name",
      key: "part_name",
      sorter: (a, b) => a.part_name.localeCompare(b.part_name),
    },

    {
      title: "Packing Standard",
      dataIndex: "packing_standard",
      key: "packing_standard",
      width: "12rem",
      sorter: (a, b) => a.packing_standard - b.packing_standard,
    },
    {
      title: "Picture Standard",
      dataIndex: "picture_standard",
      key: "picture_standard",
      width: "12rem",
      render: () => (
        <div className='flex'>
          <PhotoProvider>
            <PhotoView
              src={
                "https://raw.githubusercontent.com/Anucha3666/PTMS_PartTag-Manager-System/refs/heads/main/media/images/icon-ptms.png"
              }>
              <img
                src={
                  "https://raw.githubusercontent.com/Anucha3666/PTMS_PartTag-Manager-System/refs/heads/main/media/images/icon-ptms.png"
                }
                alt='icon-cct'
                className=' w-full !max-h-[4rem] !h-[4rem] object-cover cursor-pointer'
              />
            </PhotoView>
          </PhotoProvider>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "4rem",
      render: (_, record) => (
        <div
          className='flex gap-2 cursor-pointer'
          onClick={() => console.log(record)}>
          <Pencil
            className=' text-gray-400 hover:text-orange-400'
            onClick={() => {
              //   setIsOpen(isOpen?.concat("edit-data"));
            }}
          />
          <Trash2
            className=' text-gray-400 hover:text-red-600'
            onClick={() => {
              //   setIsOpen(isOpen?.concat("delete-data"));
            }}
          />
        </div>
      ),
    },
  ];

  const rowSelection: TableProps<DataType>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.part_no === "Disabled User",
      employee: record.part_no,
    }),
  };

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.clientHeight);
    }
  }, []);

  return (
    <div ref={divRef} className='w-full h-full'>
      <Table<DataType>
        columns={columns}
        dataSource={
          [
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
            { part_no: "1234567890", part_name: "test", packing_standard: 100 },
          ] as DataType[]
        }
        className=' w-full h-full !text-nowrap'
        rowSelection={{ type: "checkbox", ...rowSelection }}
        components={{
          header: {
            cell: (props: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
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
        scroll={{ x: "max-content", y: `${height - 400}px` }}
      />
    </div>
  );
};
