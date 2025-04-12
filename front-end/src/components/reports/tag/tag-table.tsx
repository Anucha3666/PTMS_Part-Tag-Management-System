import { WriteText } from "@/components/common";
import { SRC_DAMAGED_PICTURE, SRC_NO_PICTURE, SRC_USER } from "@/constants";
import { formatDateTime } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TTag } from "@/types";
import { Empty, Table, TableProps, Tooltip } from "antd";
import { CircleCheck, CircleSlash, Eye } from "lucide-react";
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
      title: "",
      dataIndex: "checked_at",
      key: "checked_at",
      width: "1rem",
      sorter: (a, b) =>
        String(a.checked_at).localeCompare(String(b.checked_at)),
      render: (checked_at) => (
        <div className=' w-full flex justify-center items-center cursor-help'>
          <Tooltip
            title={<p>{checked_at ? "Verified" : "Not yet verified"}</p>}>
            {checked_at ? (
              <CircleCheck className=' text-green-600' />
            ) : (
              <CircleSlash className='text-red-600' />
            )}{" "}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Tag No.",
      dataIndex: "tag_no",
      key: "tag_no",
      sorter: (a, b) => a.tag_no.localeCompare(b.tag_no),
      render: (tag_no) => <WriteText text={tag_no ?? "-"} />,
    },
    {
      title: "Part No.",
      dataIndex: ["part", "picture_std"],
      key: "picture_std",
      width: "12rem",
      sorter: (a, b) =>
        String(a?.part?.picture_std).localeCompare(
          String(b?.part?.picture_std)
        ),
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
      title: "Customer Name",
      dataIndex: ["part", "customer_name"],
      key: "customer_name",
      width: "12rem",
      sorter: (a, b) =>
        a?.part?.customer_name.localeCompare(b?.part?.customer_name),
      render: (customer_name) => <WriteText text={customer_name ?? "-"} />,
    },
    {
      title: "Part No.",
      dataIndex: ["part", "part_no"],
      key: "part_no",
      width: "8rem",
      sorter: (a, b) => a?.part?.part_no.localeCompare(b?.part?.part_no),
      render: (part_no) => <WriteText text={part_no ?? "-"} />,
    },
    {
      title: "Part Name",
      dataIndex: ["part", "part_name"],
      key: "part_name",
      width: "12rem",
      sorter: (a, b) => a?.part?.part_name.localeCompare(b?.part?.part_name),
      render: (part_name) => <WriteText text={part_name ?? "-"} />,
    },
    {
      title: "Packing Std.",
      dataIndex: ["part", "packing_std"],
      width: "6rem",
      key: "packing_std",
      sorter: (a, b) =>
        String(a?.part?.packing_std).localeCompare(
          String(b?.part?.packing_std)
        ),
      render: (packing_std) => (
        <WriteText
          text={Number(packing_std ?? 0)?.toLocaleString("en") ?? "-"}
          value={packing_std}
        />
      ),
    },
    {
      title: "Printed By",
      dataIndex: "printed_by",
      key: "printed_by",
      width: "10rem",
      sorter: (a, b) =>
        (a?.printed_by ?? "").localeCompare(b?.printed_by ?? ""),
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
      width: "10rem",
      sorter: (a, b) =>
        (a?.printed_at ?? "").localeCompare(b?.printed_at ?? ""),
      render: (printed_at) => (
        <WriteText text={formatDateTime(printed_at) ?? "-"} />
      ),
    },
    {
      title: "Checked By",
      dataIndex: "checked_by",
      key: "checked_by",
      width: "12rem",
      sorter: (a, b) =>
        String(a?.checked_by).localeCompare(String(b?.checked_by)),
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
      <ViewTagModal data={dataView} onCancel={() => setDataView({} as TTag)} />
    </div>
  );
};
