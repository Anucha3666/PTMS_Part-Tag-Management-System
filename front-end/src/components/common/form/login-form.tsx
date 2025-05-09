import { useAuth } from "@/services/hooks";
import { TLogin } from "@/types/auth";
import { cookieCryptoUtils } from "@/utils";

import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { Lock, User } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export type TLoginFormProps = {
  isTagPage?: boolean;
  onForgotPassword?: () => void;
};

export const LoginForm: FC<TLoginFormProps> = ({
  isTagPage = false,
  onForgotPassword,
}) => {
  const navigate = useNavigate();
  const { mutateSignIn } = useAuth();

  const onFinish: FormProps<TLogin>["onFinish"] = async (values) => {
    const res = await mutateSignIn(values);

    if (res?.status === "success") {
      if (values?.remember) {
        cookieCryptoUtils?.set("DATA_USER_REMEMBER", values);
      } else {
        cookieCryptoUtils.delete("DATA_USER_REMEMBER");
      }

      if (!isTagPage) {
        navigate("/parts");
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <>
      <Form
        name='basic'
        layout='vertical'
        initialValues={
          (cookieCryptoUtils?.get("DATA_USER_REMEMBER") as TLogin) || {
            remember: false,
          }
        }
        onFinish={onFinish}
        autoComplete='off'>
        <div className='w-full gap-2 flex flex-col text-white '>
          <div className=''>
            <p>Username</p>

            <Form.Item<TLogin>
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
            <Form.Item<TLogin>
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
          <div className='w-full flex justify-between items-center'>
            <Form.Item<TLogin>
              name='remember'
              valuePropName='checked'
              label={null}
              className='m-0'>
              <Checkbox className='text-white'>Remember me</Checkbox>
            </Form.Item>

            {onForgotPassword && (
              <p
                className=' text-blue-400 underline cursor-pointer hover:text-blue-500 hover:scale-105 active:scale-105'
                onClick={onForgotPassword}>
                Forgot password
              </p>
            )}
          </div>

          <Button
            type='primary'
            htmlType='submit'
            className=' bg-blue-500 hover:scale-[101%] active:scale-[99%]'>
            Sign In
          </Button>
        </div>
      </Form>
    </>
  );
};
