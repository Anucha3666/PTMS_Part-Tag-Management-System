import { cn } from "@/libs/cn";
import React, { FC, useState, useEffect, useRef } from "react";

export type MenuRootProps = {
  children: React.ReactNode;
  key?: string | number;
  className?: string;
};

export type MenuTriggerProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  key?: string | number;
  className?: string;
};

export type MenuContentProps = {
  children?: React.ReactNode;
  position?: "right" | "left";
  onClick?: () => void;
  key?: string | number;
  className?: string;
};

export type MenuItemProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  closeMenu?: () => void;
  key?: string | number;
  className?: string;
};

export const MenuRoot: FC<MenuRootProps> = ({ children, className, key }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      key={key}
      className={cn("relative inline-block text-left", className)}
      ref={menuRef}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<MenuTriggerProps>(child) &&
          child.type === MenuTrigger
        ) {
          return React.cloneElement(child, {
            onClick: handleTriggerClick,
          });
        }
        if (
          React.isValidElement<MenuContentProps>(child) &&
          child.type === MenuContent
        ) {
          return isOpen
            ? React.cloneElement(child, {
                children: React.Children.map(
                  child.props.children,
                  (menuChild) => {
                    if (
                      React.isValidElement<MenuItemProps>(menuChild) &&
                      menuChild.type === MenuItem
                    ) {
                      return React.cloneElement(menuChild, { closeMenu });
                    }
                    return menuChild;
                  }
                ),
              })
            : null;
        }
        return child;
      })}
    </div>
  );
};

export const MenuTrigger: FC<MenuTriggerProps> = ({
  onClick,
  children,
  key,
  className,
}) => (
  <button
    key={key}
    onClick={onClick}
    className={cn("focus:outline-none", className)}>
    {children}
  </button>
);

export const MenuContent: FC<MenuContentProps> = ({
  children,
  position = "right",
  key,
  className,
}) => (
  <div
    key={key}
    className={cn(
      `absolute mt-0 w-48 p-1 flex flex-col gap-1 bg-white border border-gray-200 rounded-lg shadow-lg dark:shadow-lg-dark z-20
    dark:bg-[#0B1739] dark:border-[#0B1739]`,
      position === "right" ? `right-0` : `left-0`,
      className
    )}>
    <ul>{children}</ul>
  </div>
);

export const MenuItem: FC<MenuItemProps> = ({
  children,
  onClick,
  closeMenu,
  key,
  className,
}) => {
  const handleClick = () => {
    if (onClick) onClick();
    if (closeMenu) closeMenu();
  };

  return (
    <li
      key={key}
      className={cn(
        "px-4 py-2 text-gray-700 flex gap-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-[#1B2749]",
        className
      )}
      onClick={handleClick}>
      {children}
    </li>
  );
};
