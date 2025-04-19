import { SRC_DAMAGED_PICTURE, SRC_NO_PICTURE } from "@/constants";
import { getCustomTableDarkThemeProps } from "@/helpers";
import { setPrints } from "@/store/features/print.features";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { TPart } from "@/types";
import type { TableProps } from "antd";
import { Empty, Table } from "antd";
import { Eye } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { Image } from "../36S/ui/image";
import { ViewPartModal } from "./view-part-modal";

type TDataModalPart = TPart & {
  order: "view" | "update" | "delete";
};

export type TPartTableProps = {
  search?: string;
};

export const PartTable: FC<TPartTableProps> = ({ search = "" }) => {
  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement>(null);

  const { className, rowClassName, rootClassName } =
    getCustomTableDarkThemeProps();

  const { parts } = useAppSelector((state) => state.part);
  const [height, setHeight] = useState(0);
  const [dataModal, setDataModal] = useState<TDataModalPart>(
    {} as TDataModalPart
  );

  const columns: TableProps<TPart>["columns"] = [
    {
      title: "Customer",
      dataIndex: ["customer"],
      key: "customer",
      width: "12rem",
      sorter: (a, b) =>
        String(a?.customer?.customer_name ?? "").localeCompare(
          String(b?.customer?.customer_name ?? "")
        ),
      render: (customer: TPart["customer"]) => (
        <div className=' flex gap-2 items-center font-medium  '>
          <Image
            src={customer?.logo ?? ""}
            alt='profile'
            className='!max-w-[40px] !max-h-[40px] w-[40px] h-[40px] object-cover rounded-full border-[1px] my-4 shadow-md'
          />
          <p>{customer?.customer_name ?? ""}</p>
        </div>
      ),
    },
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
                      (picture_std ?? "") === ""
                        ? SRC_NO_PICTURE
                        : SRC_DAMAGED_PICTURE;
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
                      (q_point ?? "") === ""
                        ? SRC_NO_PICTURE
                        : SRC_DAMAGED_PICTURE;
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
                      (packing ?? "") === ""
                        ? SRC_NO_PICTURE
                        : SRC_DAMAGED_PICTURE;
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
                          (src ?? "") === ""
                            ? SRC_NO_PICTURE
                            : SRC_DAMAGED_PICTURE;
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
      width: "5rem",
      fixed: "right",
      render: (_, record) => (
        <div className=' w-full justify-center items-center'>
          <div
            className='flex gap-2 cursor-pointer'
            onClick={() => console.log(record)}>
            <Eye
              className=' text-gray-400 hover:text-blue-600'
              onClick={() => {
                setDataModal({ ...record, order: "view" });
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  const rowSelection: TableProps<TPart>["rowSelection"] = {
    onChange: (_: React.Key[], selectedRows: TPart[]) => {
      dispatch(
        setPrints(selectedRows?.map((item) => ({ ...item, number_of_tags: 1 })))
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
    <>
      <div ref={divRef} className=' w-full h-full  overflow-hidden'>
        <div className='w-full h-min bg-white max-h-full rounded-md  '>
          <Table<TPart>
            columns={columns}
            dataSource={parts
              ?.filter(
                (item) =>
                  !item?.is_deleted &&
                  (search
                    ? Object.values(item)
                        .join(" ")
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    : true)
              )
              ?.map((item) => ({
                ...item,
                key: item?.part_id,
              }))}
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
            scroll={
              search === undefined
                ? { x: "max-content" }
                : { x: "max-content", y: `${height - 190}px` }
            }
            {...{ className, rowClassName, rootClassName }}
          />
        </div>
      </div>

      <ViewPartModal
        open={dataModal}
        onClose={() => setDataModal({} as TDataModalPart)}
      />
    </>
  );
};
