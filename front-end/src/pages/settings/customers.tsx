import { SettingsCustomerTable } from "@/components/settings/customers";
import { useAppSelector } from "@/store/hook";
import { Input } from "antd";
import { Search } from "lucide-react";
import { useState } from "react";
import { ForbiddenPage } from "../forbidden";

export const SettingCustomersPage = () => {
  const { dataUser } = useAppSelector((store) => store?.utils);
  const { accounts } = useAppSelector((store) => store?.account);
  const [search, setSearch] = useState<string>("");

  if (dataUser?.role !== "admin" && dataUser?.role !== "owner") {
    return <ForbiddenPage />;
  }

  return (
    <div className='p-2 w-full h-full flex flex-col gap-2 overflow-hidden'>
      <div className='w-full rounded-md h-full max-h-full flex flex-col overflow-hidden '>
        <div className=' w-full flex justify-between items-center h-min p-2 bg-white'>
          <p className=' text-lg font-bold'>Customers Settings</p>

          <Input
            size='small'
            className=' max-w-[8rem] md:max-w-[12rem] h-[2rem] mr-1'
            prefix={<Search size={20} className=' text-gray-400' />}
            placeholder='Search'
            value={search}
            onChange={(e) => setSearch(e?.target?.value)}
          />
        </div>
        {accounts?.length > 0 ? (
          <SettingsCustomerTable {...{ search }} />
        ) : (
          <SettingsCustomerTable />
        )}
      </div>
    </div>
  );
};
