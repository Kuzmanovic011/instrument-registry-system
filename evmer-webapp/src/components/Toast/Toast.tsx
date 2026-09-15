import { useToastStore } from "../../api/ToastStore";
import { useEffect } from "react";
import { FaCircleCheck, FaCircleExclamation, FaXmark } from "react-icons/fa6";

export const Toast = () => {
  const { message, type, visible, hideToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      hideToast();
    }, 4500);

    return () => clearTimeout(timer);
  }, [visible, hideToast]);

  if (!visible) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={
        "fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-[380px] rounded-xl border bg-white shadow-2xl " +
        (isSuccess ? "border-emerald-200" : "border-red-200")
      }
      role="status"
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full " +
            (isSuccess
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600")
          }
        >
          {isSuccess ? <FaCircleCheck /> : <FaCircleExclamation />}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={
              "font-semibold " +
              (isSuccess ? "text-emerald-700" : "text-red-700")
            }
          >
            {isSuccess ? "Uspešno" : "Greška"}
          </p>
          <p className="mt-1 text-sm text-slate-600">{message}</p>
        </div>
        <button
          type="button"
          onClick={hideToast}
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Zatvori obaveštenje"
        >
          <FaXmark />
        </button>
      </div>
    </div>
  );
};
