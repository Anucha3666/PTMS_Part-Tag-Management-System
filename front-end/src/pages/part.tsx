import { PrintTagDrawer } from "@/components/prints";
import { setPrints } from "@/store/features/print.features";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Button, Input } from "antd";
import { Printer, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PartTable } from "../components/part";

export const PartPage = () => {
  const dispatch = useAppDispatch();
  const { dataUser } = useAppSelector((state) => state.utils);
  const { parts } = useAppSelector((state) => state.part);
  const { prints } = useAppSelector((state) => state.print);

  const [isOpenPrintTagDrawer, setIsOpenPrintTagDrawer] = useState(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    dispatch(setPrints([]));
  }, []);

  return (
    <div className='p-2 w-full h-full flex flex-col gap-2 overflow-hidden'>
      <div className='w-full rounded-md h-full max-h-full flex flex-col overflow-hidden '>
        <div className=' w-full flex justify-between items-center h-min p-2 bg-white'>
          <p className=' text-lg font-bold'>Part</p>

          <div className=' flex gap-1 items-center justify-center'>
            <Input
              size='small'
              className=' max-w-[12rem] h-[2rem] mr-1'
              prefix={<Search size={20} className=' text-gray-400' />}
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e?.target?.value)}
            />
            {!(dataUser?.role === "viewer") && (
              <Button
                className=' px-2'
                onClick={() => setIsOpenPrintTagDrawer(true)}
                disabled={(prints?.length ?? 0) <= 0}>
                <Printer size={20} />
                Print Tag
              </Button>
            )}
          </div>
        </div>

        {parts?.length > 0 ? <PartTable {...{ search }} /> : <PartTable />}
      </div>
      {isOpenPrintTagDrawer && (
        <PrintTagDrawer open onClose={() => setIsOpenPrintTagDrawer(false)} />
      )}
    </div>
  );
};
