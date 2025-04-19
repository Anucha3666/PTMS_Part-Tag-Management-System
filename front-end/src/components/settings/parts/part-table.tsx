import { Image } from "@/components/36S/ui/image";
import { SRC_DAMAGED_PICTURE, SRC_NO_PICTURE } from "@/constants";
import { getCustomTableDarkThemeProps } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TCreatePart, TPart, TUpdatePart } from "@/types";
import { Empty, Table, TableProps, Tooltip } from "antd";
import { CirclePlus, Eye, History, Pencil, Trash2 } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import {
  CreateUpdatePartModal,
  DeletePartModal,
  ViewPartChangeHistorysModal,
  ViewPartModal,
} from "./modals";

export type TSettingsPartsTableProps = {
  search?: string;
};

type TDataModalPart = (TPart & TCreatePart) &
  (TUpdatePart & {
    order: "view" | "update" | "delete" | "create" | "change-historys";
  });

export const SettingsPartsTable: FC<TSettingsPartsTableProps> = ({
  search,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { parts } = useAppSelector((store) => store?.part);

  const { className, rowClassName, rootClassName } =
    getCustomTableDarkThemeProps();

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
      width: "12rem",
      sorter: (a, b) => a.part_no.localeCompare(b.part_no),
    },
    {
      title: "Part Name",
      dataIndex: "part_name",
      key: "part_name",
      width: "12rem",
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
        <div className=' w-full flex gap-1 justify-center items-center relative'>
          <Tooltip title={<p>View Part</p>}>
            <div className='flex gap-2 cursor-pointer'>
              <Eye
                className=' text-gray-400 hover:text-blue-600'
                onClick={() => {
                  setDataModal({ ...record, order: "view" } as TDataModalPart);
                }}
              />
            </div>
          </Tooltip>
          <Tooltip title={<p>View Part Change Historys</p>}>
            <div className='flex gap-2 cursor-pointer'>
              <History
                className=' text-gray-400 hover:text-blue-600'
                onClick={() => {
                  setDataModal({
                    ...record,
                    order: "change-historys",
                  } as TDataModalPart);
                }}
              />
            </div>
          </Tooltip>
          {!record?.is_deleted && (
            <>
              <Tooltip title={<p>Edit Account</p>}>
                <Pencil
                  className='text-gray-400 hover:text-orange-600 cursor-pointer'
                  onClick={() =>
                    setDataModal({
                      ...record,
                      order: "update",
                    } as TDataModalPart)
                  }
                />
              </Tooltip>
              <Tooltip title={<p>Delete Account</p>}>
                <Trash2
                  className='text-gray-400 hover:text-red-600 cursor-pointer'
                  onClick={() =>
                    setDataModal({
                      ...record,
                      order: "delete",
                    } as TDataModalPart)
                  }
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
      ),
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
        <Table<TPart>
          columns={columns}
          dataSource={parts?.filter((item) =>
            search
              ? Object.values(item)
                  .join(" ")
                  .toLowerCase()
                  .includes(search.toLowerCase())
              : true
          )}
          className={className}
          rowClassName={rowClassName}
          rootClassName={rootClassName}
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
          footer={() => (
            <div className='w-full flex justify-end bg-white border-b-[1px] p-4'>
              <CirclePlus
                className=' text-gray-400 hover:text-green-600 cursor-pointer'
                onClick={() => {
                  setDataModal({ order: "create" } as TDataModalPart);
                }}
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
      {(dataModal?.order === "create" || dataModal?.order === "update") && (
        <CreateUpdatePartModal
          open={dataModal}
          onClose={() => setDataModal({} as TDataModalPart)}
        />
      )}
      {dataModal?.order === "view" && (
        <ViewPartModal
          open={dataModal}
          onClose={() => setDataModal({} as TDataModalPart)}
        />
      )}
      {dataModal?.order === "change-historys" && (
        <ViewPartChangeHistorysModal
          open={dataModal}
          onClose={() => setDataModal({} as TDataModalPart)}
        />
      )}
      {dataModal?.order === "delete" && (
        <DeletePartModal
          open={dataModal}
          onClose={() => setDataModal({} as TDataModalPart)}
        />
      )}
    </div>
  );
};
