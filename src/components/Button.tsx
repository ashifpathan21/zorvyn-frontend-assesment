import { type ReactElement } from "react";

export interface ButtonProps {
  type: "side" | "primary" | "secondary" | "ghost";
  startIcon?: ReactElement;
  text: string;
  endIcon?: ReactElement;
  onClick: () => void;
  clicked?: boolean;
}
const Button = ({
  startIcon,
  type,
  text,
  endIcon,
  onClick,
  clicked = true,
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      {...props}
      className={`flex items-center font-semibold shadow justify-start gap-3 
       ${type === "side" && `p-3 pr-8 capitalize bg-neutral-50 rounded-xl hover:bg-neutral-100  ` + (clicked ? " border-l-primary-500 border-l-3 text-primary-500 " : "text-neutral-600 ")}
       ${type === "primary" && `p-2 px-4  capitalize bg-primary-500 rounded-xl hover:bg-primary-700 text-neutral-50`}
       ${type === "secondary" && `p-2 px-4 capitalize bg-neutral-200 rounded-xl text-primary-500 hover:bg-neutral-100 `}
       ${type === "ghost" && `p-1 capitalize   hover:bg-neutral-200 bg-neutral-100 ` + (clicked ? " border-b-primary-500 border-b-2 text-primary-500 " : "text-neutral-600 ")}
      `}
    >
      {startIcon && startIcon}
      <p>{text}</p>
      {endIcon && endIcon}
    </button>
  );
};

export default Button;
