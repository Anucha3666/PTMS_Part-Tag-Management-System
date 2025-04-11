import { cn } from "@/libs/cn";
import { TRole } from "@/types";
import { Tag } from "antd";
import { FC } from "react";

export type TTagRoleProps = {
  role: TRole;
  isView?: boolean;
  isDlelete?: boolean;
};

export const TagRole: FC<TTagRoleProps> = ({
  role,
  isView = false,
  isDlelete = false,
}) => {
  return (
    <Tag
      color={
        isDlelete
          ? "default"
          : role === "admin"
          ? "gold"
          : role === "user"
          ? "blue"
          : role === "owner"
          ? "red"
          : role === "viewer"
          ? "yellow"
          : "default"
      }
      key={role}
      className={cn("text-center", isView ? "" : " w-full")}>
      {String(role === "" ? "Block" : role ?? "Block")?.toLocaleUpperCase()}
    </Tag>
  );
};
