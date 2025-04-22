import { useAuth } from "@/services/hooks";
import { TForgotPassword } from "@/types/auth";

import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { User } from "lucide-react";
import { FC } from "react";

export type TForgotPasswordFormProps = {
  onSucceed?: () => void;
};

export const ForgotPasswordForm: FC<TForgotPasswordFormProps> = ({
  onSucceed,
}) => {
  const { mutateForgotPassword } = useAuth();

  const onFinish: FormProps<TForgotPassword>["onFinish"] = async (values) => {
    const res = await mutateForgotPassword(values);

    if (res?.status === "success" && onSucceed) {
      onSucceed();
    }
  };

  return (
    <>
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        autoComplete='off'>
        <div className='w-full gap-2 flex flex-col text-white '>
          <div className=''>
            <p>Employee Number</p>
            <Form.Item<TForgotPassword>
              name='employee_number'
              rules={[
                { required: true, message: "Enter your 7-digit code." },
                {
                  pattern: /^\d{7}$/,
                  message: "Code must be exactly 7 digits.",
                },
              ]}
              className='m-0 w-full'>
              <Input.OTP length={7} inputMode='numeric' className='w-full' />
            </Form.Item>
          </div>
          <div className=' w-full'>
            <div className=''>
              <p>Username</p>

              <Form.Item<TForgotPassword>
                name='username'
                rules={[
                  {
                    required: true,
                    message: "Enter your username.",
                  },
                ]}
                className='m-0'>
                <Input
                  placeholder='Please enter your username.'
                  prefix={<User size={20} className=' -ml-1 text-gray-400' />}
                />
              </Form.Item>
            </div>
          </div>

          <Button
            type='primary'
            htmlType='submit'
            className=' bg-blue-500 hover:scale-[101%] active:scale-[99%]'>
            Send request
          </Button>
        </div>
      </Form>
    </>
  );
};
