interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}

export const Notification = ({
  message,
  type = "success",
  onClose,
}: NotificationProps) => {
  const styles = {
    success: "border-green-500 text-green-800",
    error: "border-red-500 text-red-800",
    info: "border-blue-500 text-blue-800",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] w-80 border-l-4 rounded-lg shadow-lg px-5 py-4 ${styles[type]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold">
            {type === "success" && "Uspešno"}
            {type === "error" && "Greška"}
            {type === "info" && "Informacija"}
          </p>

          <p className="mt-1 text-sm">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="text-lg font-bold opacity-60 hover:opacity-100"
        >
          x
        </button>
      </div>
    </div>
  );
};
