import { ReportPrintedTable } from "@/components/reports/printed";
import { useAppSelector } from "@/store/hook";
import { Input } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";

export const ReportPrintedPage = () => {
  const { printeds } = useAppSelector((state) => state.printed);
  const [search, setSearch] = useState<string>("");

  return (
    <div className='p-2 w-full h-full flex flex-col gap-2 overflow-hidden'>
      <div className='w-full rounded-md h-full max-h-full flex flex-col overflow-hidden '>
        <div className=' w-full flex justify-between items-center h-min p-2 bg-white'>
          <p className=' text-lg font-bold'>Report Printed</p>

          <div className=' flex gap-1 items-center justify-center'>
            <Input
              size='small'
              className=' max-w-[8rem] md:max-w-[12rem] h-[2rem] mr-1'
              prefix={<Search size={20} className=' text-gray-400' />}
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e?.target?.value)}
            />
          </div>
        </div>

        {printeds?.length > 0 ? (
          <ReportPrintedTable {...{ search }} />
        ) : (
          <ReportPrintedTable />
        )}
      </div>
    </div>
  );
};
