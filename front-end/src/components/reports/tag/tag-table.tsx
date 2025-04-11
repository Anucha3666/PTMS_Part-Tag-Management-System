import { WriteText } from "@/components/common";
import { SRC_DAMAGED_PICTURE, SRC_NO_PICTURE, SRC_USER } from "@/constants";
import { formatDateTime } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TTag } from "@/types";
import { Empty, Table, TableProps, Tooltip } from "antd";
import { CirclePlus, Eye } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { ViewTagModal } from "./view-tag-modal";

export type ReportTagTableProps = {
  search?: string;
};

export const ReportTagTable: FC<ReportTagTableProps> = ({ search }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { tags } = useAppSelector((store) => store?.tag);
  const { accounts } = useAppSelector((store) => store?.account);

  const [height, setHeight] = useState(0);
  const [dataView, setDataView] = useState<TTag>({} as TTag);

  const columns: TableProps<TTag>["columns"] = [
    {
      title: "Tag No.",
      dataIndex: "tag_no",
      key: "tag_no",
      sorter: (a, b) => a.tag_no.localeCompare(b.tag_no),
      render: (tag_no) => <WriteText text={tag_no ?? "-"} />,
    },
    {
      title: "Part No.",
      dataIndex: "picture_std",
      key: "picture_std",
      width: "12rem",
      sorter: (a, b) =>
        String(a.picture_std).localeCompare(String(b.picture_std)),
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
      title: "Part No.",
      dataIndex: "part_no",
      key: "part_no",
      width: "8rem",
      sorter: (a, b) => a.part_no.localeCompare(b.part_no),
      render: (part_no) => <WriteText text={part_no ?? "-"} />,
    },
    {
      title: "Part Name",
      dataIndex: "part_name",
      key: "part_name",
      width: "12rem",
      sorter: (a, b) => a.part_name.localeCompare(b.part_name),
      render: (part_name) => <WriteText text={part_name ?? "-"} />,
    },
    {
      title: "Packing Std.",
      dataIndex: "packing_std",
      width: "6rem",
      key: "packing_std",
      sorter: (a, b) =>
        String(a.packing_std).localeCompare(String(b.packing_std)),
      render: (packing_std) => (
        <WriteText
          text={Number(packing_std ?? 0)?.toLocaleString("en") ?? "-"}
          value={packing_std}
        />
      ),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
      sorter: (a, b) => a.created_by.localeCompare(b.created_by),
      render: (created_by) => {
        const account = accounts?.find(
          ({ account_id }) => created_by === account_id
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
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      width: "10rem",
      sorter: (a, b) => a.created_at.localeCompare(b.created_at),
      render: (created_at) => (
        <WriteText text={formatDateTime(created_at) ?? "-"} />
      ),
    },
    {
      title: "Checked By",
      dataIndex: "checked_by",
      key: "checked_by",
      sorter: (a, b) =>
        String(a.checked_by).localeCompare(String(b.checked_by)),
      render: (checked_by) => {
        const account = accounts?.find(
          ({ account_id }) => checked_by === account_id
        );
        return (
          <>
            {(checked_by ?? "") !== "" && (
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
            )}
          </>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "checked_at",
      key: "checked_at",
      width: "10rem",
      sorter: (a, b) =>
        String(a.checked_at).localeCompare(String(b.checked_at)),
      render: (checked_at) => (
        <>
          {(checked_at ?? "") !== "" && (
            <WriteText text={formatDateTime(checked_at) ?? "-"} />
          )}
        </>
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
        <Table<TTag>
          columns={columns}
          dataSource={tags?.filter((item) =>
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
                // onClick={onOpen}
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
      <ViewTagModal data={dataView} onCancel={() => setDataView({} as TTag)} />
    </div>
  );
};
