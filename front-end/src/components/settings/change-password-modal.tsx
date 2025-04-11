import { useAuth } from "@/services/hooks";
import { Form, Input, Modal } from "antd";
import { FC } from "react";

export type TChangePasswordModalProps = {
  open: boolean;
  onCancel: () => void;
};

export const ChangePasswordModal: FC<TChangePasswordModalProps> = ({
  open,
  onCancel,
}) => {
  const { mutateChangePassword } = useAuth();
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((payload) => {
      mutateChangePassword(payload);
      onCancel();
    });
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      title='Change Password'
      open={open}
      width={"18rem"}
      okText='Confirm'
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form
        form={form}
        layout='vertical'
        name='changePasswordForm'
        initialValues={{ remember: true }}
        className=' flex flex-col gap-0'>
        <Form.Item
          label='Old Password'
          name='password'
          rules={[
            { required: true, message: "Please input your old password!" },
          ]}>
          <Input.Password placeholder='Please input your old password!' />
        </Form.Item>

        <Form.Item
          label='New Password'
          name='new_password'
          rules={[
            { required: true, message: "Please input your new password!" },
            {
              min: 6,
              message: "Password must be at least 6 characters.",
            },
          ]}>
          <Input.Password placeholder='Please input your new password!' />
        </Form.Item>

        <Form.Item
          label='Confirm New Password'
          name='confirmPassword'
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}>
          <Input.Password placeholder='Please confirm your new password!' />
        </Form.Item>
      </Form>
    </Modal>
  );
};
