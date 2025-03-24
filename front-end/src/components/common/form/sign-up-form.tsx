import { useAuth } from "@/services/hooks";
import { TSignUp } from "@/types/auth";

import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { Lock, User } from "lucide-react";
import { FC } from "react";

export type TSignUpFormProps = {
  setOrder?: (order: string) => void;
};

export const SignUpForm: FC<TSignUpFormProps> = ({ setOrder }) => {
  const { mutateSignUp } = useAuth();

  const onFinish: FormProps<TSignUp>["onFinish"] = async (values) => {
    const res = await mutateSignUp(values);
    if (res?.status === "success") if (setOrder) setOrder("sign-in");
  };

  return (
    <>
      <Form
        name='basic'
        layout='vertical'
        onFinish={onFinish}
        autoComplete='off'>
        <div className='w-full gap-2 flex flex-col text-white '>
          <div className=' w-full'>
            <p>Employee number</p>
            <Form.Item<TSignUp>
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
            <p>First name</p>

            <Form.Item<TSignUp>
              name='first_name'
              rules={[
                {
                  required: true,
                  message: "Enter your first name.",
                },
              ]}
              className='m-0'>
              <Input
                placeholder='Please enter your first name.'
                prefix={<User size={20} className=' -ml-1 text-gray-400' />}
              />
            </Form.Item>
          </div>
          <div className=' w-full'>
            <p>Last name</p>

            <Form.Item<TSignUp>
              name='last_name'
              rules={[
                {
                  required: true,
                  message: "Enter your last name.",
                },
              ]}
              className='m-0'>
              <Input
                placeholder='Please enter your last name.'
                prefix={<User size={20} className=' -ml-1 text-gray-400' />}
              />
            </Form.Item>
          </div>
          <div className=' w-full'>
            <p>Username</p>

            <Form.Item<TSignUp>
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
          <div className=' w-full'>
            <p>Password</p>
            <Form.Item<TSignUp>
              name='password'
              rules={[
                {
                  required: true,
                  message: "Enter your password.",
                },
              ]}
              className='m-0'>
              <Input.Password
                prefix={<Lock size={20} className=' -ml-1 text-gray-400' />}
                placeholder='Please enter your password.'
              />
            </Form.Item>
          </div>

          <Button
            type='primary'
            htmlType='submit'
            className=' bg-blue-500 mt-1 hover:scale-[101%] active:scale-[99%]'>
            Sign Up
          </Button>
        </div>
      </Form>
    </>
  );
};
