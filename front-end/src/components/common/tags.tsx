import { TRole } from "@/types";
import { Tag } from "antd";
import { FC } from "react";

export type TTagRoleProps = {
  role: TRole;
};

export const TagRole: FC<TTagRoleProps> = ({ role }) => {
  return (
    <Tag
      color={
        role === "admin"
          ? "gold"
          : role === "user"
          ? "blue"
          : role === "owner"
          ? "gold-inverse"
          : role === "viewer"
          ? "yellow"
          : role === ""
          ? "red"
          : "default"
      }
      key={role}
      className=' w-full text-center'>
      {String(role ?? "No Rights")?.toLocaleUpperCase()}
    </Tag>
  );
};
