import { TAccount } from "@/types";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Spin,
  Upload,
} from "antd";
import { useEffect, useState } from "react";

export const SettingProfilePage = () => {
  const [form] = Form.useForm();
  const [account] = useState<TAccount | null>(null);
  const [loading] = useState(true);
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

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <Spin size='large' tip='Loading profile...' />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px" }}>
      <Card>
        <p>Profile Settings</p>
        <Divider />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                src={account?.profile_picture}
                icon={<UserOutlined />}
              />
              <div style={{ marginTop: 16 }}>
                <p>{`${account?.first_name} ${account?.last_name}`}</p>
                <br />
                <p>{account?.position}</p>
              </div>
              <div style={{ marginTop: 16 }}>
                <p>Employee #: {account?.employee_number}</p>
                <br />
                <p>Username: {account?.username}</p>
                <br />
                <p>Role: {account?.role}</p>
              </div>
            </div>
          </Col>

          <Col xs={24} md={16}>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              initialValues={{
                first_name: account?.first_name,
                last_name: account?.last_name,
                position: account?.position,
              }}>
              <Row gutter={16}>
                <Col span={12}>
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
                </Col>
                <Col span={12}>
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
                </Col>
              </Row>

              <Form.Item
                name='position'
                label='Position'
                rules={[
                  { required: true, message: "Please enter your position" },
                ]}>
                <Input />
              </Form.Item>

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

            <Divider />

            <div>
              <p>Account Information</p>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <p>Created:</p>
                </Col>
                <Col span={12}>
                  <p>
                    {new Date(account?.created_at || "").toLocaleDateString()}
                  </p>
                </Col>

                <Col span={12}>
                  <p>Last Updated:</p>
                </Col>
                <Col span={12}>
                  <p>
                    {new Date(account?.updated_at || "").toLocaleDateString()}
                  </p>
                </Col>

                <Col span={12}>
                  <p>Account Status:</p>
                </Col>
                <Col span={12}>
                  <p>
                    {account?.is_approved ? "Approved" : "Pending Approval"}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
