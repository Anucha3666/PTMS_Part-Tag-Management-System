import { SRC_UPLODE_PICTURE } from "@/constants";
import { useAccount } from "@/services/hooks";
import { setDataUser } from "@/store/features/utils.features";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { TAuth } from "@/types";
import { Form, Input, Modal, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { Trash2 } from "lucide-react";
import { FC, useState } from "react";

export type TEditProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

export const EditProfileModal: FC<TEditProfileModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { mutateUpdateAccount } = useAccount();
  const dispatch = useAppDispatch();

  const { dataUser } = useAppSelector((state) => state?.utils);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    dataUser?.profile_picture ?? null
  );

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

      const res = await mutateUpdateAccount({ ...payload, profile_picture });
      if (res.status === "success") {
        const data = (res?.data as TAuth[])[0];

        dispatch(
          setDataUser({
            ...dataUser,
            first_name: data?.first_name,
            last_name: data?.last_name,
            profile_picture: dataUser?.profile_picture?.concat(
              String(data?.profile_picture)
            )
              ? dataUser?.profile_picture
              : data?.profile_picture,
            updated_at: data?.updated_at,
          })
        );
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
      title='Edit Profile'
      open={open}
      width={"38rem"}
      okText='Confirm'
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form
        form={form}
        layout='vertical'
        name='EditProfile'
        initialValues={dataUser}
        className='flex w-full items-center gap-4'>
        <Form.Item
          label='Profile Picture'
          valuePropName='fileList'
          className=' min-w-[14rem] min-h-[17rem] w-[14rem] h-[17rem] max-w-[14rem] max-h-[17rem] overflow-hidden'>
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
                className='min-w-[14rem] min-h-[14rem] w-[14rem] h-[14rem] max-w-[14rem] max-h-[14rem] rounded-full cursor-pointer border-[1px] shadow-md'
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
              className='min-w-[14rem] min-h-[14rem] w-[14rem] h-[14rem] max-w-[14rem] max-h-[14rem] rounded-full cursor-pointer border-[1px] shadow-md'
            />
          </Upload>
        </Form.Item>

        <div className=' w-full'>
          <Form.Item
            label='First name'
            name='first_name'
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}>
            <Input placeholder='Please input your first name!' />
          </Form.Item>
          <Form.Item
            label='Last name'
            name='last_name'
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}>
            <Input placeholder='Please input your last name!' />
          </Form.Item>
          <Form.Item
            label='Position'
            name='position'
            rules={[
              { required: true, message: "Please input your position!" },
            ]}>
            <Input placeholder='Please input your position!' />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
