import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ComponentType<any>;
  error?: string;
}

const Input: React.FC<InputProps> = ({ icon: Icon, error, ...props }) => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-[#82a0b6]" />
      </div>
      <input
        {...props}
        className={`w-full pl-10 pr-4 py-3 bg-white rounded-lg border-2 ${
          error ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#ff7f50]"
        } focus:ring-2 ${
          error ? "focus:ring-red-200" : "focus:ring-[#ff7f50]/20"
        } text-gray-700 placeholder-gray-400 transition-all duration-300 outline-none`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
