import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "../../style.css";

interface DeleteEquipmentProps {
  close: () => void;
  deleteItemId: number | undefined;
  deleteFunction: (id: number, note: string | undefined) => void;
}

const DeleteEquipmentSchema = z.object({
  note: z.string().optional(),
});

type shemaType = z.infer<typeof DeleteEquipmentSchema>;

export const DeleteEquipment = ({
  close,
  deleteItemId,
  deleteFunction,
}: DeleteEquipmentProps) => {
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm<shemaType>({
    resolver: zodResolver(DeleteEquipmentSchema),
    mode: "onSubmit",
    defaultValues: {
      note: undefined,
    },
  });

  const onSubmit = (data: shemaType) => {
    if (deleteItemId) deleteFunction(deleteItemId, data.note);
  };

  return (
    <>
      <GenericDialogModal
        cancelClick={close}
        modalTitle="Brisanje opreme"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          register={register("note")}
          placeHolder="napomena"
          labelId="note"
          labelTitle="Unesite napomenu"
        />

        <></>
      </GenericDialogModal>
    </>
  );
};
