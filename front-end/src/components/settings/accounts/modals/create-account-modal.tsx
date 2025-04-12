import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/36S/ui";
import { TagRole } from "@/components/common";
import { SRC_UPLODE_PICTURE } from "@/constants";
import { useAccount } from "@/services/hooks";
import { TCreateAccount, TRole } from "@/types";
import { Form, Input, Modal, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";

export type TCreateAccountModalProps = {
  open: boolean;
  onClose: () => void;
};

export const CreateAccountModal: FC<TCreateAccountModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { mutateCreateAccount } = useAccount();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [role, setRole] = useState<TRole>("viewer");

  const handleChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);

    const latestFile = fileList[fileList.length - 1];
    if (latestFile?.originFileObj) {
      const url = URL.createObjectURL(latestFile.originFileObj);
      setPreviewUrl(url);
    }
  };

  const handleOk = async () => {
    try {
      const payload = await form.validateFields();

      const profile_picture =
        fileList?.length > 0 ? fileList[0].originFileObj : previewUrl ?? null;

      const res = await mutateCreateAccount({
        ...payload,
        profile_picture,
        role,
      });
      if (res.status === "success") {
        onClose();
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      title='Create Account'
      open={open}
      width={"46.8rem"}
      okText='Confirm'
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form<TCreateAccount>
        form={form}
        layout='vertical'
        initialValues={{ role: "viewer" }}
        name='EditProfile'
        className=' w-full flex flex-col gap-0'>
        <div className='flex w-full items-center gap-4'>
          <div className=' min-w-[10rem] min-h-[12.4rem] w-[10rem] h-[12.4rem] max-w-[10rem] max-h-[12.4rem] overflow-hidden'>
            {previewUrl && (
              <div className=' relative'>
                <Trash2
                  className=' cursor-pointer absolute top-0 right-0 text-gray-400 
            hover:text-red-500 hover:rotate-12 hover:scale-105
             active:text-red-400 active:rotate-0 active:scale-95'
                  onClick={() => {
                    setFileList([]);
                    setPreviewUrl("");
                  }}
                />
                <img
                  src={previewUrl}
                  alt='preview'
                  className='min-w-[10rem] min-h-[10rem] w-[10rem] h-[10rem] max-w-[10rem] max-h-[10rem] rounded-full cursor-pointer border-[1px] shadow-md'
                />
              </div>
            )}
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleChange}
              showUploadList={false}
              className={previewUrl ? "hidden" : ""}>
              <img
                src={SRC_UPLODE_PICTURE}
                alt='uplode_picture'
                className='min-w-[10rem] min-h-[10rem] w-[10rem] h-[10rem] max-w-[10rem] max-h-[10rem] rounded-full cursor-pointer border-[1px] shadow-md'
              />
            </Upload>
          </div>

          <div className=' w-full grid h-min grid-cols-2 gap-x-2'>
            <Form.Item<TCreateAccount>
              label='First name'
              name='first_name'
              rules={[{ required: true, message: "Please input first name!" }]}>
              <Input placeholder='Please input first name!' />
            </Form.Item>
            <Form.Item<TCreateAccount>
              label='Last name'
              name='last_name'
              rules={[{ required: true, message: "Please input last name!" }]}>
              <Input placeholder='Please input last name!' />
            </Form.Item>

            <Form.Item
              label='Employee number'
              name='employee_number'
              rules={[
                {
                  required: true,
                  message: "Please input your 7-digit employee number!",
                },
                {
                  len: 7,
                  message: "Employee number must be exactly 7 digits!",
                },
                {
                  pattern: /^\d+$/,
                  message: "Employee number must be numbers only!",
                },
              ]}>
              <Input.OTP
                length={7}
                type='number'
                autoFocus
                className=' text-center rounded-md no-spinner'
              />
            </Form.Item>

            <Form.Item<TCreateAccount> label='Position' name='position'>
              <Input placeholder='Please input position!' />
            </Form.Item>
          </div>
        </div>
        <div className=' w-full grid h-min grid-cols-3 gap-x-2 -mt-6'>
          <Form.Item<TCreateAccount>
            label='Username'
            name='username'
            rules={[{ required: true, message: "Please input username!" }]}>
            <Input placeholder='Please input username!' />
          </Form.Item>
          <Form.Item<TCreateAccount>
            label='Password'
            name='password'
            rules={[{ required: true, message: "Please input password!" }]}>
            <Input.Password placeholder='Please input password!' />
          </Form.Item>
          <Form.Item<TCreateAccount>
            label='Role'
            name='first_name'
            rules={[{ required: true, message: "" }]}>
            <MenuRoot className=' w-full z-40'>
              <MenuTrigger className=' w-full'>
                <TagRole role={role} />
              </MenuTrigger>
              <MenuContent>
                {["viewer", "user", "admin", "owner", ""]
                  ?.filter((info) => info !== role)
                  ?.map((item, i) => (
                    <MenuItem key={i} onClick={() => setRole(item as TRole)}>
                      {item === "" ? "BLOCK" : item?.toLocaleUpperCase()}
                    </MenuItem>
                  ))}
              </MenuContent>
            </MenuRoot>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
