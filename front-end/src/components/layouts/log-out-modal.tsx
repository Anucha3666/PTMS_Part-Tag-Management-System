import { SERVICE_CONFIG_DATA_USER } from "@/constants";
import { cookieCryptoUtils } from "@/utils";
import { Modal } from "antd";
import { LogOutIcon } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export type LogOutModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const LogOutModal: FC<LogOutModalProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const handleOk = () => {
    setIsOpen(false);
    cookieCryptoUtils?.delete(SERVICE_CONFIG_DATA_USER);
    navigate("/login");
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        title={
          <div className='flex gap-2'>
            <LogOutIcon />
            <p>Sign Out</p>
          </div>
        }
        open={isOpen}
        okText='Confirm'
        okType='danger'
        onOk={handleOk}
        onCancel={handleCancel}>
        <p>Please click "Confirm" to sign out.</p>
      </Modal>
    </>
  );
};
