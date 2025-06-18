import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        {...props}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
