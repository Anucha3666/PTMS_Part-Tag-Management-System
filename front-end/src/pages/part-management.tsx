import { Button, Input } from "antd";
import { Printer, Search } from "lucide-react";
import { PartTable } from "../components/part";
import { useState } from "react";
import { PrintTagDrawer } from "@/components/prints";

export const PartManagementPage = () => {
  const [isOpenPrintTagDrawer, setIsOpenPrintTagDrawer] = useState(false);

  return (
    <>
      <div className='p-4 w-screen h-screen flex flex-col overflow-hidden'>
        <div className='w-full bg-white rounded-md h-min max-h-full flex flex-col shadow-xl overflow-hidden'>
          <div className=' w-full flex justify-between items-center h-min p-2'>
            <p className=' text-lg font-medium'>Part Management</p>
            <div className=' flex gap-1'>
              <Input
                size='small'
                className=' max-w-[12rem] h-[2rem] mr-1'
                prefix={<Search size={20} className=' text-gray-400' />}
                placeholder='Search'
              />

              <Button
                className=' px-2'
                onClick={() => setIsOpenPrintTagDrawer(true)}>
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
