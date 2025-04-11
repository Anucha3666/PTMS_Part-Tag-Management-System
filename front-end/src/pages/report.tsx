import { PrintTagDrawer } from "@/components/prints";
import { PrintingHistorysTable } from "@/components/reports";
import { Input } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";

export const ReportPage = () => {
  const [isOpenPrintTagDrawer, setIsOpenPrintTagDrawer] = useState(false);

  return (
    <>
      <div className='p-4 w-screen h-screen flex flex-col overflow-hidden'>
        <div className='w-full bg-white p-2 rounded-md h-min max-h-full flex flex-col shadow-xl overflow-hidden'>
          <div className=' w-full flex justify-between items-center h-min p-2'>
            <p className=' text-lg font-bold'>Part Management</p>
            <Input
              size='small'
              className=' max-w-[12rem] h-[2rem] mr-1'
              prefix={<Search size={20} className=' text-gray-400' />}
              placeholder='Search'
            />
          </div>
          <div className=' w-full h-full flex overflow-hidden'>
            <PrintingHistorysTable />
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
