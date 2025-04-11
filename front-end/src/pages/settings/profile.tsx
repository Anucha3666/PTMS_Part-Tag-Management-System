import { SRC_USER } from "@/constants";
import { formatDateTime } from "@/helpers";
import { useAppSelector } from "@/store/hook";
import { TAuth } from "@/types";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { Button, Form, Input, message, Space, Upload } from "antd";
import { useEffect, useState } from "react";

export const SettingProfilePage = () => {
  const { dataUser } = useAppSelector((state) => state.utils);

  const [form] = Form.useForm();
  const [account] = useState<TAuth | null>(dataUser);

  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    // const fetchAccount = async () => {
    //   try {
    //     setTimeout(() => {
    //       setAccount(mockAccount);
    //       form.setFieldsValue({
    //         first_name: mockAccount.first_name,
    //         last_name: mockAccount.last_name,
    //         position: mockAccount.position,
    //       });
    //       setLoading(false);
    //     }, 1000);
    //   } catch (error) {
    //     message.error("Failed to fetch account data");
    //     setLoading(false);
    //   }
    // };
    // fetchAccount();
  }, [form]);

  //   const handleSubmit = async (values: TUpdateAccount) => {
  const handleSubmit = async () => {
    try {
      setUploading(true);

      //   const updateData: TUpdateAccount = {
      //     account_id: account?.account_id || "",
      //     first_name: values.first_name,
      //     last_name: values.last_name,
      //     position: values.position,
      //     profile_picture:
      //       fileList.length > 0 ? fileList[0].url : account?.profile_picture,
      //   };

      //   setTimeout(() => {
      //     setAccount({
      //       ...account!,
      //       ...updateData,
      //       updated_at: new Date().toISOString(),
      //     });
      //     message.success("Profile updated successfully");
      //     setUploading(false);
      //   }, 1500);
    } catch {
      message.error("Failed to update profile");
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      // Simulate file upload
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const newFile: UploadFile = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: reader.result as string,
        };
        setFileList([newFile]);
      };
      return false;
    },
    fileList,
  };

  // if (loading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}>
  //       <Spin size='large' tip='Loading profile...' />
  //     </div>
  //   );
  // }

  return (
    <div className='p-2 w-full h-full flex flex-col overflow-hidden'>
      <div className='w-full bg-white p-2 rounded-md h-min max-h-full flex flex-col shadow-xl overflow-hidden'>
        <div className=' w-full flex justify-between items-center h-min p-2'>
          <p className=' text-lg font-bold'>Profile Settings</p>
        </div>

        <div className=' w-full h-full flex gap-2'>
          <div className=' flex w-[24rem] flex-col items-center'>
            <img
              src={dataUser?.profile_picture ?? ""}
              alt='profile'
              width={"160px"}
              height={"160px"}
              className=' rounded-full border-[1px] my-4'
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = SRC_USER;
              }}
            />

            <div className='flex w-full flex-col gap-1 px-2 text-sm'>
              <p className='text-lg font-bold w-full '>Account Information</p>
              <div className='w-full flex justify-between'>
                <p>Created at : </p>
                <p>{formatDateTime(dataUser?.created_at)}</p>
              </div>
              <div className='w-full flex justify-between'>
                <p>Last updated : </p>
                <p>{formatDateTime(dataUser?.updated_at)}</p>
              </div>
            </div>
          </div>
          <div className=' w-full'>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              initialValues={{
                first_name: account?.first_name,
                last_name: account?.last_name,
                position: account?.position,
              }}>
              <div className='w-full grid-cols-3 grid gap-2'>
                <Form.Item
                  name='first_name'
                  label='First Name'
                  rules={[
                    {
                      required: true,
                      message: "Please enter your first name",
                    },
                  ]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  name='last_name'
                  label='Last Name'
                  rules={[
                    {
                      required: true,
                      message: "Please enter your last name",
                    },
                  ]}>
                  <Input />
                </Form.Item>

                <Form.Item
                  name='position'
                  label='Position'
                  rules={[
                    { required: true, message: "Please enter your position" },
                  ]}>
                  <Input />
                </Form.Item>
              </div>

              <Form.Item name='profile_picture' label='Profile Picture'>
                <Upload {...uploadProps} listType='picture'>
                  <Button icon={<UploadOutlined />}>Select New Image</Button>
                </Upload>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type='primary' htmlType='submit' loading={uploading}>
                    Save Changes
                  </Button>
                  <Button onClick={() => form.resetFields()}>Reset</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
