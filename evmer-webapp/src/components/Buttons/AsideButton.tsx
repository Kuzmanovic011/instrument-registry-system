import type { MouseEventHandler, ReactNode } from "react";
import "../../style.css";

type ButtonProps = {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
  active?: boolean;
};

export const AsideButton = ({ buttonText, onClick, icon, active = false }: ButtonProps) => {
  return (
    <>
      <button
        className={"flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 " + (
          active
            ? "bg-brand-50 text-brand-700"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )}
        onClick={onClick}
        disabled={false}
      >
        {icon && <span className={"text-base " + (active ? "text-brand-600" : "text-slate-400")}>{icon}</span>}
        {buttonText}
      </button>
    </>
  );
};
