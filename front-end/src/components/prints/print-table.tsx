import { setPrints } from "@/store/features/print.features";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { TPart, TPrintTag } from "@/types";
import type { TableProps } from "antd";
import { Empty, Input, Table } from "antd";
import { Minus, Plus } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

type TDataTable = TPart & TPrintTag & { index: number };

export const PrintTable: FC = () => {
  const dispatch = useAppDispatch();
  const divRef = useRef<HTMLDivElement>(null);

  const { prints } = useAppSelector((state) => state.print);

  const [height, setHeight] = useState(0);

  const columns: TableProps<TDataTable>["columns"] = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      sorter: (a, b) => a.customer_name.localeCompare(b.customer_name),
    },
    {
      title: "Part No.",
      dataIndex: "part_no",
      key: "part_no",
      width: "12rem",
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
      title: "Action",
      key: "index",
      width: "10rem",
      fixed: "right",
      render: (_, record) => (
        <div className='flex gap-2 cursor-pointer justify-center items-center'>
          <div className=' bg-slate-100 rounded-md   p-1 flex justify-center items-center'>
            <Plus
              onClick={() =>
                dispatch(
                  setPrints(
                    prints
                      ?.slice(0, record?.index)
                      ?.concat({
                        ...record,
                        number_of_tags: record?.number_of_tags + 1,
                      })
                      ?.concat(prints?.slice(record?.index + 1))
                  )
                )
              }
            />
            <div className=' !w-[3rem] flex '>
              <Input
                value={record?.number_of_tags}
                className=' text-center'
                onChange={(e) =>
                  dispatch(
                    setPrints(
                      prints
                        ?.slice(0, record?.index)
                        ?.concat({
                          ...record,
                          number_of_tags:
                            isNaN(Number(e?.target?.value)) ||
                            Number(e?.target?.value) <= 0
                              ? 0
                              : Number(e?.target?.value),
                        })
                        ?.concat(prints?.slice(record?.index + 1))
                    )
                  )
                }
              />
            </div>
            <Minus
              onClick={() =>
                dispatch(
                  setPrints(
                    prints
                      ?.slice(0, record?.index)
                      ?.concat({
                        ...record,
                        number_of_tags:
                          record?.number_of_tags - 1 <= 0
                            ? 0
                            : record?.number_of_tags - 1,
                      })
                      ?.concat(prints?.slice(record?.index + 1))
                  )
                )
              }
            />
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (divRef.current) {
      setHeight(divRef.current.clientHeight);
    }
  }, []);

  return (
    <div ref={divRef} className='w-full h-full'>
      <Table<TDataTable>
        columns={columns}
        dataSource={prints?.map((item, i) => ({ ...item, index: i }))}
        className=' w-full h-full !text-nowrap'
        components={{
          header: {
            cell: (props: React.HTMLAttributes<HTMLTableHeaderCellElement>) => (
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
        scroll={{ x: "max-content", y: `${height - 100}px` }}
      />
    </div>
  );
};
