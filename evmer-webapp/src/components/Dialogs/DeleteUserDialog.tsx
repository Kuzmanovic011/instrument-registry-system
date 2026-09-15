import { GenericDialogModal } from "./GenericDialogModal";

interface DeleteUserDialogProps {
  close: () => void;
  deleteUserId?: number;
  deleteFunction: (id: number) => Promise<void>;
}

export const DeleteUserDialog = ({
  close,
  deleteUserId,
  deleteFunction,
}: DeleteUserDialogProps) => {
  const onSubmit = async () => {
    if (deleteUserId !== undefined) {
    await deleteFunction(deleteUserId);
  }
};

  return (
    <GenericDialogModal
      modalTitle="DEAKTIVIRAJ KORISNIKA"
      onSubmit={onSubmit}
      cancelClick={close}
      buttonDisable={false}
    >
        <></>
      <div>
        <p>Da li ste sigurni da želite da deaktivirate korisnika?</p>
      </div>
    </GenericDialogModal>
  );
};