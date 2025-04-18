import { usePrint } from "@/services/hooks";
import { useAppSelector } from "@/store/hook";
import { TPrintedTag, TPrintedTagSummary } from "@/types";
import { Button, Drawer, Segmented } from "antd";
import { Printer } from "lucide-react";
import { FC, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PDFTag from "./pdf/tag";
import { PrintTable } from "./print-table";

export type TPrintTagDrawer = {
  open?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
};

export const PrintTagDrawer: FC<TPrintTagDrawer> = ({
  open = false,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { mutatePrintTags } = usePrint();

  const { prints } = useAppSelector((state) => state.print);
  const [segmented, setSegmented] = useState("Part List");
  const [printedTag, setPrintedTag] = useState<TPrintedTag>({} as TPrintedTag);

  const printTags = async () => {
    const data = await mutatePrintTags(prints);

    if (data?.status === "success") {
      setPrintedTag(
        ((Array.isArray(data?.data) ? data?.data[0] : {}) ?? {}) as TPrintedTag
      );
      setTimeout(() => handlePrint(), 400);
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Document Title",
    onAfterPrint: () => console.log("Printing completed"),
  });

  useEffect(() => {
    setSegmented("Part List");
  }, [open]);

  return (
    <Drawer
      title='Print Tags'
      width={"230mm"}
      open={open}
      onClose={onClose}
      footer={
        <div className=' w-full flex justify-end'>
          <Button
            className=' flex gap-2 px-2 font-medium'
            onClick={printTags}
            disabled={
              (prints?.find(({ number_of_tags }) => (number_of_tags ?? 0) > 0)
                ?.number_of_tags ?? 0) === 0
            }>
            <Printer size={20} />
            Print
          </Button>
        </div>
      }>
      <div className=' flex flex-col gap-2 w-full h-full overflow-hidden'>
        <Segmented<string>
          options={["Part List", "Preview"]}
          className=' w-min p-1 gap-2'
          value={segmented}
          onChange={(value) => setSegmented(value)}
        />
        <div className=' w-full h-full overflow-auto'>
          <div className='flex w-full rounded-md overflow-hidden flex-col space-y-2'>
            {segmented === "Part List" ? (
              <PrintTable />
            ) : (
              <PDFTag
                data={
                  {
                    summary: prints as TPrintedTagSummary[],
                  } as TPrintedTag
                }
                isView
              />
            )}
          </div>
        </div>
        <div className=' hidden'>
          <div ref={printRef}>
            <PDFTag data={printedTag} />
          </div>
        </div>
      </div>
    </Drawer>
  );
};
