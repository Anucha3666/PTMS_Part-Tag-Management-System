import { Ellipsis, FileClock, FileText, List } from "lucide-react";
import { FC } from "react";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../36S/ui";

export type PartManagementMenuProps = {
  isOpen: string[];
  setIsOpen: (isOpen: string[]) => void;
  isMonitor?: boolean;
};

export const PartManagementMenu: FC<PartManagementMenuProps> = ({
  isOpen,
  setIsOpen,
  isMonitor,
}) => {
  const data = [
    {
      label: "ประวัติงานเสีย",
      icon: <FileText size={22} />,
      onClick: () => setIsOpen(isOpen?.concat("history-defective")),
    },
    {
      label: "ประวัติการส่งงาน",
      icon: <FileClock size={22} />,
      onClick: () => setIsOpen(isOpen?.concat("submission-history")),
    },
    {
      label: `รายการงานผลิต`,
      icon: <List size={22} />,
      onClick: () => setIsOpen(isOpen?.concat("work-list")),
    },
    // {
    //   label: "ปริ้น Tag",
    //   icon: <Printer size={22} />,
    //   onClick: () => setIsOpen(isOpen?.concat("print-tag")),
    // }, ื
  ]?.slice(0, isMonitor ? 3 : 10);
  return (
    <MenuRoot>
      <MenuTrigger>
        <Ellipsis />
      </MenuTrigger>
      <MenuContent>
        {data?.map(({ label, icon, onClick }, i) => (
          <MenuItem key={i} {...{ onClick }}>
            {icon} {label}
          </MenuItem>
        ))}
      </MenuContent>
    </MenuRoot>
  );
};
