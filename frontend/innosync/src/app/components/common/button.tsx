import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function Button({ label, ...props }: ButtonProps) {
  return (
    <button {...props} className="px-4 py-2 bg-blue-600 text-white rounded">
      {label}
    </button>
  );
}
