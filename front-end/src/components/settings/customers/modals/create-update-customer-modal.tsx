import { SRC_UPLODE_PICTURE } from "@/constants";
import { useCustomer } from "@/services/hooks";
import { TCreateUpdateCustomer, TCustomer } from "@/types";
import { Form, Input, Modal, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import type { UploadFile } from "antd/es/upload/interface";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";

type TModal = TCustomer & { order: "view" | "delete" | "create" | "update" };

export type TCreateUpdateCustomerModalProps = {
  open: TModal;
  onClose: () => void;
};

export const CreateUpdateCustomerModal: FC<TCreateUpdateCustomerModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { mutateCreateCustomer, mutateUpdateCustomer } = useCustomer();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(open?.logo);

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

      const logo =
        fileList?.length > 0 ? fileList[0].originFileObj : previewUrl ?? null;

      const res =
        open?.order === "create"
          ? await mutateCreateCustomer({
              ...payload,
              logo,
            })
          : await mutateUpdateCustomer({
              ...payload,
              customer_id: open?.customer_id,
              logo,
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
      title={`${open?.order?.slice(0, 1)?.toUpperCase()}${open?.order?.slice(
        1
      )} customer`}
      open={open?.order === "create" || open?.order === "update"}
      width={"20rem"}
      okText='Confirm'
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form<TCreateUpdateCustomer>
        form={form}
        layout='vertical'
        initialValues={{ ...open }}
        name='EditProfile'
        className=' w-full flex flex-col gap-0'>
        <div className='flex flex-col w-full items-center gap-0'>
          <div className='w-full flex gap-1'>
            <p className=' w-full '>Customer logo</p>
          </div>
          <div className=' min-w-[8rem] min-h-[9rem] w-[8rem] h-[9rem] max-w-[8rem] max-h-[9rem] overflow-hidden'>
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
                  className='min-w-[8rem] min-h-[8rem] w-[8rem] h-[8rem] max-w-[8rem] max-h-[8rem] rounded-full cursor-pointer border-[1px] shadow-md'
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
                className='min-w-[8rem] min-h-[8rem] w-[8rem] h-[8rem] max-w-[8rem] max-h-[8rem] rounded-full cursor-pointer border-[1px] shadow-md'
              />
            </Upload>
          </div>
          <div className=' w-full'>
            <Form.Item<TCreateUpdateCustomer>
              label='Customer name'
              name='customer_name'
              rules={[
                { required: true, message: "Please input customer name!" },
              ]}>
              <Input placeholder='Please input customer name!' />
            </Form.Item>
            <Form.Item<TCreateUpdateCustomer>
              label='Customer description'
              name='customer_description'
              rules={[
                {
                  message: "Please input customer description!",
                },
              ]}>
              <TextArea placeholder='Please input customer description!' />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
