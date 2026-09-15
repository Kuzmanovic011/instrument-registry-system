import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DeleteReservationRequest } from "../../api/reservations/reservations";

interface DeleteReservationProps {
  cancelClick: () => void;
  showMenu: boolean;
  modalTitle: string;
  idEquipment: number | undefined;
  deleteReservation: (id: number, data: DeleteReservationRequest) => void;
}

const DeleteReservationSchema = z.object({
  note: z.string(),
});

type shemaType = z.infer<typeof DeleteReservationSchema>;

export const DeleteReservationDialog = ({
  showMenu,
  cancelClick,
  idEquipment,
  deleteReservation,
}: DeleteReservationProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(DeleteReservationSchema),
    mode: "onChange",
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = (data: shemaType) => {
    if (idEquipment === undefined) return;
    deleteReservation(idEquipment, data);
    reset();
  };

  const onError = (formErrors: typeof errors) => {
    console.log("Forma nije validna:", formErrors);
    console.log("isValid:", isValid);
    console.log("errors:", errors);
  };

  return (
    <>
      {showMenu && (
        <GenericDialogModal
          modalTitle="Brisanje rezervacije"
          cancelClick={cancelClick}
          buttonDisable={!isValid}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <label></label>
          <Input
            register={register("note")}
            id="note"
            placeHolder="Napomena za otkazivanje rezervacije"
            labelId="note"
            labelTitle="Unesite napomenu za otkazivanje rezervacije"
          />
        </GenericDialogModal>
      )}
    </>
  );
};
