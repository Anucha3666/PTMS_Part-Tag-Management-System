import { SRC_DAMAGED_PICTURE, SRC_NO_PICTURE } from "@/constants";
import { cn } from "@/libs/cn";
import { FC } from "react";

export type TImageProps = {
  src?: string | null;
  alt?: string | null;
  className?: string;
  srcErrorNoPicture?: string | null;
  srcErrorDamagedPicture?: string | null;
};

export const Image: FC<TImageProps> = ({
  src = null,
  alt = null,
  className = "",
  srcErrorNoPicture = null,
  srcErrorDamagedPicture = null,
}) => {
  return (
    <img
      src={src ?? ""}
      alt={alt ?? "img"}
      className={cn(
        "inset-0 object-contain transition-all duration-200",
        className ?? "w-full h-full"
      )}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src =
          (src ?? "") === ""
            ? (srcErrorNoPicture ?? "") === ""
              ? SRC_NO_PICTURE
              : srcErrorNoPicture ?? ""
            : (srcErrorDamagedPicture ?? "") === ""
            ? SRC_DAMAGED_PICTURE
            : srcErrorDamagedPicture ?? "";
      }}
    />
  );
};
