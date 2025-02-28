import { useAuth } from "@/services/hooks";
import { TAuth, TLogin } from "@/types/auth";
import { cookieCryptoUtils } from "@/utils";

import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { Lock, User } from "lucide-react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

export type TLoginFormProps = {
  isMachine?: boolean;
};

export const LoginForm: FC<TLoginFormProps> = () => {
  const navigate = useNavigate();
  const { mutateSignIn } = useAuth();

  const onFinish: FormProps<TLogin>["onFinish"] = async (values) => {
    try {
      if (values?.remember) {
        cookieCryptoUtils?.set("DATA_USER_REMEMBER", values);
      } else {
        cookieCryptoUtils.delete("DATA_USER_REMEMBER");
      }
      const res = await mutateSignIn(values);

      if (res?.status === "success") {
        navigate("/part-management");
      }
    } catch (error) {
      console.error("SIGN_IN_ERROR", error);
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
        <div className='w-full gap-4 flex flex-col text-white '>
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
          <div className='w-full flex justify-end'>
            <Form.Item<TLogin>
              name='remember'
              valuePropName='checked'
              label={null}
              className='m-0'>
              <Checkbox className='text-white'>Remember</Checkbox>
            </Form.Item>
          </div>

          <Button
            type='primary'
            htmlType='submit'
            className=' bg-blue-500 hover:scale-[101%] active:scale-[99%]'>
            เข้าสู่ระบบ
          </Button>
        </div>
      </Form>
    </>
  );
};
