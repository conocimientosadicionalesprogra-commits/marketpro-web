import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { pl } from "date-fns/locale/pl";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  className = "",
  icon,
  type = "text",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type;
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <div className={`mb-4 ${widthClass}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          className={`
            py-2 px-4 
            ${icon ? "pl-10" : ""}
            border border-gray-300 rounded-md
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
            ${widthClass}
            ${className}
          `}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;