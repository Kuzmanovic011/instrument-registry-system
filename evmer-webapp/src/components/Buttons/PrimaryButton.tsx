import type { MouseEventHandler } from "react";

interface ButtonProps {
  buttonText?: string;
  buttonColor?: "red" | "white" | "blue";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isDisable?: boolean;
  buttonType?: "submit" | "button";
}


const colorMap = {
  red: "border-red-600 bg-red-600 text-white enabled:hover:border-red-700 cursor-pointer enabled:hover:bg-red-700 focus-visible:ring-red-300",
  white:
    "border-slate-300 bg-white text-slate-700 enabled:hover:bg-slate-50 cursor-pointer enabled:hover:text-slate-900 focus-visible:ring-slate-200",
  blue: "border-brand-600 bg-brand-600 text-white enabled:hover:border-brand-700 cursor-pointer enabled:hover:bg-brand-700 focus-visible:ring-brand-200",
};

export const PrimaryButton = ({
  buttonText = "submit",
  buttonColor = "blue",
  onClick,
  isDisable = false,
  buttonType = "submit",
}: ButtonProps) => {
  return (
    <button
      className={`${colorMap[buttonColor]} inline-flex min-h-8 items-center justify-center rounded-md border px-2.5 py-1 text-xs font-semibold shadow-sm transition-colors duration-150 focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50`}
      onClick={onClick}
      disabled={isDisable}
      type={buttonType}
    >
      {buttonText}
    </button>
  );
};
