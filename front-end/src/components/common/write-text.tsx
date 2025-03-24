import { FC } from "react";

export type TWriteTextProps = {
  text?: string;
  value?: string | number;
  children?: React.ReactNode;
};

export const WriteText: FC<TWriteTextProps> = ({
  text = "",
  value,
  children,
}) => {
  const data = String(value ?? text ?? "");
  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(data);

        const toast = document.createElement("div");
        toast.textContent = `คัดลอก '${data}' เรียบร้อยแล้ว!`;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "#333";
        toast.style.color = "#fff";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "8px";
        toast.style.zIndex = "1000";
        toast.style.fontSize = "14px";
        toast.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.remove();
        }, 3000);
      }}>
      <p>{text}</p>

      {children}
    </div>
  );
};
