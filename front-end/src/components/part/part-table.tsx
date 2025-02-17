import { Empty, Table } from "antd";
import type { TableProps } from "antd";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoView } from "react-photo-view";
import { PhotoProvider } from "react-photo-view";
import { CreateUpdatePartModal } from "./create-update-part-modal";
import { useDisclosure } from "@/helpers";
import { TPart } from "@/types";
import { useAppSelector } from "@/store/hook";
import { ViewPartModal } from "./view-part-modal";
import { DeletePartModal } from "./delete-part-modal";

type TDataModalPart = TPart & { order: "view" | "update" | "delete" };

export const PartTable: FC = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { parts } = useAppSelector((state) => state.parts);
  const [height, setHeight] = useState(0);
  const [dataModal, setDataModal] = useState<TDataModalPart>(
    {} as TDataModalPart
  );

  const isUpdate =
    (dataModal?.part_id ?? "") !== "" && dataModal?.order === "update";

  const columns: TableProps<TPart>["columns"] = [
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
      dataIndex: "packing_std",
      key: "packing_std",
      width: "12rem",
      sorter: (a, b) => a.packing_std - b.packing_std,
    },
    {
      title: "Picture Standard",
      dataIndex: "picture_std",
      key: "picture_std",
      width: "12rem",
      render: (picture_std) => (
        <div className='flex'>
          <PhotoProvider>
            <PhotoView src={picture_std}>
              <div className='relative w-full h-[4rem] bg-slate-50 rounded-md'>
                <img
                  src={picture_std}
                  alt={`picture_std`}
                  className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                />
              </div>
            </PhotoView>
          </PhotoProvider>
        </div>
      ),
    },
    {
      title: "Q-Point",
      dataIndex: "q_point",
      key: "q_point",
      width: "6rem",
      render: (q_point) => (
        <div className='flex'>
          <PhotoProvider>
            <PhotoView src={q_point}>
              <div className='relative w-[4rem] h-[4rem] bg-slate-50 rounded-md'>
                <img
                  src={q_point}
                  alt={`q_point`}
                  className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                />
              </div>
            </PhotoView>
          </PhotoProvider>
        </div>
      ),
    },
    {
      title: "Packing",
      dataIndex: "packing",
      key: "packing",
      width: "6rem",
      render: (packing) => (
        <div className='flex'>
          <PhotoProvider>
            <PhotoView src={packing}>
              <div className='relative w-[4rem] h-[4rem] bg-slate-50 rounded-md'>
                <img
                  src={packing}
                  alt={`packing`}
                  className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                />
              </div>
            </PhotoView>
          </PhotoProvider>
        </div>
      ),
    },
    {
      title: "More pictures",
      dataIndex: "more_pictures",
      key: "more_pictures",
      width: "14rem",
      render: (more_pictures: TPart["more_pictures"]) => (
        <PhotoProvider>
          <div className='flex gap-1'>
            {more_pictures?.map((src, i) => (
              <PhotoView key={i} src={src}>
                <div className='relative w-[4rem] h-[4rem] bg-slate-50 rounded-md'>
                  <img
                    src={src}
                    alt={`more_pictures.${i + 1}`}
                    className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                  />
                </div>
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
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
          <Eye
            className=' text-gray-400 hover:text-blue-600'
            onClick={() => {
              setDataModal({ ...record, order: "view" });
            }}
          />
          <Pencil
            className=' text-gray-400 hover:text-orange-400'
            onClick={() => {
              setDataModal({ ...record, order: "update" });
            }}
          />
          <Trash2
            className=' text-gray-400 hover:text-red-600'
            onClick={() => {
              setDataModal({ ...record, order: "delete" });
            }}
          />
        </div>
      ),
    },
  ];

  const rowSelection: TableProps<TPart>["rowSelection"] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: TPart[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: TPart) => ({
      disabled: record.part_no === "Disabled User",
      employee: record.part_no,
    }),
  };

  useEffect(() => {
    if (divRef.current && height === 0) {
      setHeight(divRef.current.clientHeight);
    }
  }, [height]);

  return (
    <div ref={divRef} className=' w-full h-full'>
      <Table<TPart>
        columns={columns}
        dataSource={parts?.map((item) => ({ ...item, key: item?.part_id }))}
        className=' w-full !text-nowrap'
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
        footer={() => (
          <div className='w-full flex justify-end bg-white border-b-[1px] p-4'>
            <CirclePlus
              className=' text-gray-400 hover:text-green-600 cursor-pointer'
              onClick={onOpen}
            />
          </div>
        )}
        scroll={{ x: "max-content", y: `${height - 230}px` }}
      />
      <CreateUpdatePartModal
        open={isOpen || isUpdate}
        isUpdate={isUpdate}
        onClose={onClose}
      />
      <ViewPartModal open={dataModal?.order === "view"} onClose={onClose} />
      <DeletePartModal open={dataModal?.order === "delete"} onClose={onClose} />
    </div>
  );
};
