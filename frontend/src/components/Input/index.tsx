import React, { ChangeEvent, useState } from "react";
import { BsEyeSlashFill, BsEyeFill, BsSearch } from "react-icons/bs";
import { HiPaperClip } from "react-icons/hi";

interface InputProps {
  label?: string;
  name: string;
  type?: "number" | "text" | "email" | "password";
  search?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onIconClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string | number;
  placeholder?: string;
  errors?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  search = false,
  type = "text",
  placeholder,
  value,
  errors,
  onChange,
  onIconClick,
  onKeyDown,
  ...rest
}) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-primary text-xs block mb-0.5 ml-3.5"
        >
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-xl bg-transparent ${
          search ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-[#c4ccf4]"
        }`}
      >
        {search && (
          <button onClick={onIconClick} className="flex items-center">
            <HiPaperClip className="absolute left-3 text-primary" size={18} />
          </button>
        )}
        <input
          type={type === "password" && !hidePassword ? "text" : type}
          id={name}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          className={`w-full h-[36px] shadow appearance-none rounded-xl py-2 ${
            search ? "pl-10" : "pl-4"
          } pr-4 text-[15px] transition-all bg-transparent border focus:outline-none ${
            errors ? "border-error" : "border-gray-300"
          }`}
          value={value}
          onChange={onChange}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setHidePassword(!hidePassword)}
            className="absolute right-4 top-2 hover:cursor-pointer"
          >
            {hidePassword ? (
              <BsEyeSlashFill size={18} />
            ) : (
              <BsEyeFill size={18} />
            )}
          </button>
        )}
      </div>
      {typeof errors !== "boolean" && errors && (
        <span className="text-xs text-red-500 ml-3.5">
          {errors.message ? errors.message : errors}
        </span>
      )}
    </div>
  );
};

export default Input;
