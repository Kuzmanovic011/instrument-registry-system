import { Form, type Formprops } from "../Forms/Form";
import { PrimaryButton } from "../Buttons/PrimaryButton";

export type ActiveDialog =
  | "edit"
  | "editUser"
  | "add"
  | "details"
  | "delete"
  | "basicModal"
  | "addCalibration"
  | "nextCalibration"
  | "assign"
  | "unassign"
  | "fault-report"
  | "addReservation"
  | "deleteReservation"
  | "changePassword"
  | "changePasswordAdmin"
  | "addEquipmentCategory"
  | "faultResolve"
  | null;

export interface GenericDialogModalProps<T> extends Partial<Formprops> {
  cancelClick: () => void;
  modalTitle: string;
  rowData?: T;
  hasFileUpload?: boolean;
  buttonDisable?: boolean;
}

export const GenericDialogModal = <T,>({
  onSubmit,
  cancelClick,
  modalTitle,
  children,
  hasFileUpload = false,
  buttonDisable,
}: GenericDialogModalProps<T>) => {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-[2px]">
        <div className="surface-card my-auto w-full max-w-3xl overflow-hidden shadow-2xl">
          <h1 className="border-b border-slate-200 px-6 py-4 text-lg font-semibold text-slate-900">
            {modalTitle}
          </h1>
          <div className="p-6">
            <Form
              onSubmit={onSubmit}
              enctype={hasFileUpload ? "multipart/form-data" : undefined}
            >
              <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2 [&>*]:w-full">
                {children}
              </div>
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                <PrimaryButton
                  buttonText="odustani"
                  buttonColor="white"
                  onClick={cancelClick}
                  buttonType="button"
                />
                <PrimaryButton
                  buttonText="potvrdi"
                  buttonType="submit"
                  isDisable={buttonDisable}
                />
              </div>
              <></>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};
