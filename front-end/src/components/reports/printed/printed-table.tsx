import { WriteText } from "@/components/common";
import { SRC_DAMAGED_PICTURE, SRC_NO_PICTURE, SRC_USER } from "@/constants";
import { formatDateTime } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TPrintedTag } from "@/types";
import { Empty, Table, TableProps, Tooltip } from "antd";
import { Eye } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { ViewPDFPrintedModal } from "./view-pdf-printed-modal";

export type ReportPrintedtTableProps = {
  search?: string;
};

export const ReportPrintedTable: FC<ReportPrintedtTableProps> = ({
  search,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { printeds } = useAppSelector((store) => store?.printed);
  const { accounts } = useAppSelector((store) => store?.account);

  const [height, setHeight] = useState(0);
  const [dataView, setDataView] = useState<TPrintedTag>({} as TPrintedTag);

  const columns: TableProps<TPrintedTag>["columns"] = [
    {
      title: "Printed ID",
      dataIndex: "printed_id",
      key: "printed_id",
      sorter: (a, b) => a.printed_id.localeCompare(b.printed_id),
      render: (printed_id) => <WriteText text={printed_id ?? "-"} />,
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      render: (summary: TPrintedTag["summary"]) => (
        <div className=' flex flex-col gap-2'>
          {summary?.map(({ picture_std, number_of_tags, part_no }, index) => (
            <div
              key={index}
              className=' flex gap-2 items-center font-medium justify-between'>
              <div className='flex gap-2 items-center font-medium'>
                <div className='flex w-[12rem]'>
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

                <p>{part_no}</p>
              </div>
              <p>[x {number_of_tags}]</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Printed By",
      dataIndex: "printed_by",
      key: "printed_by",
      sorter: (a, b) => a.printed_by.localeCompare(b.printed_by),
      render: (printed_by) => {
        const account = accounts?.find(
          ({ account_id }) => printed_by === account_id
        );
        return (
          <div className=' flex gap-2 items-center font-medium  '>
            <img
              src={account?.profile_picture ?? ""}
              alt='profile'
              width='40'
              height='40'
              className='!max-w-[40px] !max-h-[40px] w-[40px] h-[40px] object-cover rounded-full border-[1px] my-4 shadow-md'
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  account?.profile_picture ?? "" === ""
                    ? SRC_USER
                    : SRC_DAMAGED_PICTURE;
              }}
            />
            <p>{account?.first_name}</p>
            <p>{account?.last_name}</p>
          </div>
        );
      },
    },

    {
      title: "Printed At",
      dataIndex: "printed_at",
      key: "printed_at",
      sorter: (a, b) => a.printed_at.localeCompare(b.printed_at),
      render: (printed_at) => (
        <WriteText text={formatDateTime(printed_at) ?? "-"} />
      ),
    },

    {
      title: "Action",
      key: "action",
      width: "5rem",
      fixed: "right",
      render: (_, record) => {
        return (
          <div className='flex justify-center  items-center gap-2'>
            <Tooltip title={<p>View PDF Printed</p>}>
              <Eye
                className='text-gray-400 hover:text-blue-600 cursor-pointer'
                onClick={() => setDataView(record)}
              />
            </Tooltip>
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
        <Table<TPrintedTag>
          columns={columns}
          dataSource={printeds?.filter((item) =>
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
                    ...props?.style,
                    textAlign: "center",
                  }}>
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
              : { x: "max-content", y: `${height - 175}px` }
          }
        />
      </div>
      <ViewPDFPrintedModal
        data={dataView}
        onCancel={() => setDataView({} as TPrintedTag)}
      />
    </div>
  );
};
