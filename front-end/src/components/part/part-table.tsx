import { TPart } from "@/types";
import type { TableProps } from "antd";
import { Empty, Table } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { CreateUpdatePartModal } from "./create-update-part-modal";
import { DeletePartModal } from "./delete-part-modal";
import { ViewPartModal } from "./view-part-modal";

type TDataModalPart = TPart & { order: "view" | "update" | "delete" };

export const PartTable: FC = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(0);
  const [dataModal, setDataModal] = useState<TDataModalPart>(
    {} as TDataModalPart
  );

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
                  src={picture_std ?? ""}
                  alt={`picture_std`}
                  className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://raw.githubusercontent.com/Anucha3666/PTMS_Part-Tag-Management-System/refs/heads/main/media/images/no-picture.png";
                  }}
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
                  src={q_point ?? ""}
                  alt={`q_point`}
                  className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://raw.githubusercontent.com/Anucha3666/PTMS_Part-Tag-Management-System/refs/heads/main/media/images/no-picture.png";
                  }}
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
                  src={packing ?? ""}
                  alt={`packing`}
                  className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "https://raw.githubusercontent.com/Anucha3666/PTMS_Part-Tag-Management-System/refs/heads/main/media/images/no-picture.png";
                  }}
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
            {((more_pictures?.length ?? 0) === 0 ? [""] : more_pictures)?.map(
              (src, i) => (
                <PhotoView key={i} src={src}>
                  <div className='relative w-[4rem] h-[4rem] bg-slate-50 rounded-md'>
                    <img
                      src={src ?? ""}
                      alt={`more_pictures.${i + 1}`}
                      className='absolute inset-0 w-full h-full object-contain transition-all duration-200 cursor-pointer'
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://raw.githubusercontent.com/Anucha3666/PTMS_Part-Tag-Management-System/refs/heads/main/media/images/no-picture.png";
                      }}
                    />
                  </div>
                </PhotoView>
              )
            )}
          </div>
        </PhotoProvider>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "4rem",
      fixed: "right",
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
    onChange: (_: React.Key[], selectedRows: TPart[]) => {
      // dispatch(
      //   setPrintTags(selectedRows?.map((item) => ({ ...item, no_tags: 1 })))
      // );
      console.log(selectedRows);
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
    <>
      <div ref={divRef} className=' w-full h-full overflow-hidden'>
        <div className='w-full h-min bg-white max-h-full rounded-md dark:shadow-md-dark'>
          <Table<TPart>
            columns={columns}
            // dataSource={parts?.map((item) => ({
            //   ...item,
            //   key: item?.part_id,
            // }))}
            className=' w-full !text-nowrap p-2'
            rowSelection={{ type: "checkbox", ...rowSelection, fixed: "left" }}
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
              // y: parts?.length < 7 ? "max-content" : `${height - 190}px`,
            }}
          />
        </div>
      </div>
      <CreateUpdatePartModal
        open={dataModal?.order === "update"}
        data={dataModal}
        onClose={() => setDataModal({} as TDataModalPart)}
      />
      <ViewPartModal
        open={dataModal}
        onClose={() => setDataModal({} as TDataModalPart)}
      />
      <DeletePartModal
        open={dataModal}
        onClose={() => setDataModal({} as TDataModalPart)}
      />
    </>
  );
};
