import { IoWarningOutline } from "react-icons/io5";

interface NoDataErrorProps {
  message?: string;
}

export const NoDataError = ({ message = "ERROR" }: NoDataErrorProps) => {
  return (
    <>
      <div className="surface-card flex flex-col items-center justify-center px-6 py-10 text-center">
        <div>
          <IoWarningOutline className="h-12 w-12 text-amber-500" />
        </div>
        <div>
          <p className="mt-2 text-sm font-medium text-slate-600">{message}</p>
        </div>
      </div>
    </>
  );
};
