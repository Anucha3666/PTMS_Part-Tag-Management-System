import { PrintTagDrawer } from "@/components/prints";
import { useAppSelector } from "@/store/hook";
import { Button, Input } from "antd";
import { Printer, Search } from "lucide-react";
import { useState } from "react";
import { PartTable } from "../components/part";

export const PartPage = () => {
  const { prints } = useAppSelector((state) => state.print);
  const [isOpenPrintTagDrawer, setIsOpenPrintTagDrawer] = useState(false);

  return (
    <>
      <div className='p-2 w-full h-full flex flex-col overflow-hidden'>
        <div className='w-full bg-white p-2 rounded-md h-min max-h-full flex flex-col shadow-xl overflow-hidden'>
          <div className=' w-full flex justify-between items-center h-min p-2'>
            <p className=' text-lg font-bold'>Part</p>
            <Input
              size='small'
              className=' max-w-[12rem] h-[2rem] mr-1'
              prefix={<Search size={20} className=' text-gray-400' />}
              placeholder='Search'
            />
            <div className=' flex gap-1 items-center justify-center'>
              <Button
                className=' px-2'
                onClick={() => setIsOpenPrintTagDrawer(true)}
                disabled={(prints?.length ?? 0) <= 0}>
                <Printer size={20} />
                Print Tag
              </Button>
            </div>
          </div>
          <div className=' w-full h-full flex overflow-hidden'>
            <PartTable />
          </div>
        </div>
      </div>

      <PrintTagDrawer
        open={isOpenPrintTagDrawer}
        onClose={() => setIsOpenPrintTagDrawer(false)}
      />
    </>
  );
};
