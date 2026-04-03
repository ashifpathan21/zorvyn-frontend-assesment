import type{ InputHTMLAttributes } from "react";
import { RiSearchLine } from "@remixicon/react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: "normal" | "search";
};

const Input = ({ variant = "normal", className = "", ...props }: InputProps) => {
  if (variant === "search") {
    return (
      <label className={`flex items-center gap-3 rounded-2xl bg-neutral-200 px-4 py-2 ${className}`}>
        <RiSearchLine className="h-5 w-5 text-neutral-500" />
        <input
          type="search"
          className="w-full bg-transparent text-sm outline-none"
          {...props}
        />
      </label>
    );
  }

  return (
    <div className={`rounded-2xl bg-neutral-200 px-4 py-3 ${className}`}>
      <input
        type="text"
        className="w-full bg-transparent text-sm outline-none"
        {...props}
      />
    </div>
  );
};

export default Input;
