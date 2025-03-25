import { ChangePasswordModal } from "@/components/settings";
import { useDisclosure } from "@/helpers";
import { Card } from "antd";
import { BookUser, Lock, UserRoundPen } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export const SettingsPage: FC = () => {
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const DATA_MENU_SETTINGS = [
    {
      label: "Profile",
      description:
        "View and edit your personal information, contact details, and profile picture.",
      icon: <UserRoundPen size={60} />,
      page: "profile",
    },
    {
      label: "Accounts",
      description:
        "Manage team account information, including names, roles, and system access permissions.",
      icon: <BookUser size={60} />,
      page: "accounts",
    },
    {
      label: "Change Password",
      description:
        "Update your password for better security and account protection.",
      icon: <Lock size={60} />,
      page: "change-password",
    },
  ];

  return (
    <>
      <div className='px-4 w-full h-min max-h-full gap-4 overflow-auto pb-4 grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 '>
        {DATA_MENU_SETTINGS?.map(({ label, description, icon, page }, i) => (
          <Card
            key={i}
            className=' min-h-[6rem] h-[6rem] max-h-[6rem] flex items-center p-2 shadow-sm hover:scale-[101%] active:scale-[99%] cursor-pointer'
            onClick={() =>
              page === "change-password" ? onOpen() : navigate(page)
            }>
            <div className=' flex gap-2'>
              {icon}
              <div className='flex h-full flex-col'>
                <p className=' text-md font-medium'>{label}</p>
                <p className=' text-sm'>{description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ChangePasswordModal open={isOpen} onCancel={onClose} />
    </>
  );
};
