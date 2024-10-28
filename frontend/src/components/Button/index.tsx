import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit";
  size?: "small" | "medium" | "big";
  icon?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size,
  type = "button",
  disabled = false,
  icon,
  ...rest
}) => {
  return (
    <button
      type={type}
      className="bg-primary text-white h-9 px-10 font-semibold rounded-xl transition-all focus:shadow-outline hover:bg-[#6e8fe3]"
      {...rest}
    >
      <div className="flex items-center justify-center gap-2 whitespace-nowrap">
        {icon}
        {children}
      </div>
    </button>
  );
};

export default Button;
