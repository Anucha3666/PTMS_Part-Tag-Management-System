import { AccountTable } from "@/components/settings";
import { useAppSelector } from "@/store/hook";
import { Input } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";

export const SettingAccountsPage = () => {
  const { accounts } = useAppSelector((store) => store?.account);
  const [search, setSearch] = useState<string>("");

  return (
    <>
      <div className='px-4 w-full h-full flex flex-col gap-2 overflow-hidden pb-4'>
        <div className='w-full rounded-md h-full max-h-full flex flex-col overflow-hidden '>
          <div className=' w-full flex justify-end items-center h-min p-2 bg-white dark:bg-[#02042D] '>
            <Input
              size='small'
              className=' max-w-[12rem] h-[2rem] mr-1 dark:bg-[#081028]'
              prefix={<Search size={20} className=' text-gray-400' />}
              placeholder='Search'
              value={search}
              onChange={(e) => setSearch(e?.target?.value)}
            />
          </div>
          {accounts?.length > 0 ? (
            <AccountTable {...{ search }} />
          ) : (
            <AccountTable />
          )}
        </div>
      </div>
    </>
  );
};
