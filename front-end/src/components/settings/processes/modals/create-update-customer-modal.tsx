import { useProcess } from "@/services/hooks";
import { TCreateUpdateProcess, TProcess } from "@/types";
import { Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { FC } from "react";

type TModal = TProcess & { order: "view" | "delete" | "create" | "update" };

export type TCreateUpdateProcessModalProps = {
  open: TModal;
  onClose: () => void;
};

export const CreateUpdateProcessModal: FC<TCreateUpdateProcessModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const { mutateCreateProcess, mutateUpdateProcess } = useProcess();

  const handleOk = async () => {
    try {
      const payload = await form.validateFields();

      const res =
        open?.order === "create"
          ? await mutateCreateProcess(payload)
          : await mutateUpdateProcess({
              ...payload,
              process_id: open?.process_id ?? "",
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
      )} process`}
      open={open?.order === "create" || open?.order === "update"}
      width={"20rem"}
      okText='Confirm'
      onOk={handleOk}
      onCancel={handleCancel}>
      <Form<TCreateUpdateProcess>
        form={form}
        layout='vertical'
        initialValues={{ ...open }}
        name='EditProfile'
        className=' w-full flex flex-col gap-0'>
        <div className='flex flex-col w-full items-center gap-0'>
          <div className='w-full'>
            <Form.Item<TCreateUpdateProcess>
              label='Process name'
              name='process_name'
              rules={[
                { required: true, message: "Please input process name!" },
              ]}>
              <Input placeholder='Please input process name!' />
            </Form.Item>
            <Form.Item<TCreateUpdateProcess>
              label='Process description'
              name='process_description'
              rules={[
                {
                  message: "Please input process description!",
                },
              ]}>
              <TextArea placeholder='Please input process description!' />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
