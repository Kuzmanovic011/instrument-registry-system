import { PrimaryButton } from "../Buttons/PrimaryButton";
import type { TableRowType } from "../Tables/Table";

interface ModalProps {
  message: string;
  onClose?: () => void;
  row?: TableRowType | null;
}

export const Modal = ({ message, onClose }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className="surface-card w-full max-w-md overflow-hidden shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Obaveštenje</h2>
        </div>

        <div className="px-6 py-8">
          <p className="text-center text-base text-slate-600">{message}</p>
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <PrimaryButton
            buttonColor="blue"
            buttonText="U redu"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};
