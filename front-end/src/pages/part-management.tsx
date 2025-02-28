import { Button, Input } from "antd";
import { CirclePlus, Printer, Search } from "lucide-react";
import { CreateUpdatePartModal, PartTable } from "../components/part";
import { useState } from "react";
import { PrintTagDrawer } from "@/components/prints";
import { useDisclosure } from "@/helpers";
import { useAppSelector } from "@/store/hook";

export const PartManagementPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { printTags } = useAppSelector((state) => state.printTags);
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
            <div className=' flex gap-1 items-center justify-center'>
              <Button
                className=' px-2'
                onClick={() => setIsOpenPrintTagDrawer(true)}
                disabled={(printTags?.length ?? 0) <= 0}>
                <Printer size={20} />
                Print Tag
              </Button>
              <Button className=' px-2' onClick={() => onOpen()}>
                <CirclePlus size={20} />
                Add Print
              </Button>
            </div>
          </div>
          <div className=' w-full h-full flex overflow-hidden'>
            <PartTable />
          </div>
        </div>
      </div>

      <CreateUpdatePartModal open={isOpen} onClose={onClose} />
      <PrintTagDrawer
        open={isOpenPrintTagDrawer}
        onClose={() => setIsOpenPrintTagDrawer(false)}
      />
    </>
  );
};
