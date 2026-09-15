import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import type { DeleteReservationRequest } from "../../api/reservations/reservations";

export interface FaultResolveDialogProps {
  cancelClick: () => void;
  showMenu: boolean;
  faultResolveFunction: (data: DeleteReservationRequest) => void;
}

const FaultResolveSchema = z.object({
  note: z.string(),
});

type shemaType = z.infer<typeof FaultResolveSchema>;

export const FaultResolveDialog = ({
  cancelClick,
  showMenu,
  faultResolveFunction,
}: FaultResolveDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(FaultResolveSchema),
    mode: "onChange",
  });

  const onSubmit = (data: shemaType) => {
    faultResolveFunction(data);
    reset();
  };

  const onError = (formErrors: typeof errors) => {
    console.log("Forma nije validna:", formErrors);
  };

  return (
    <>
      {showMenu && (
        <GenericDialogModal
          modalTitle="Rešavanje kvara"
          onSubmit={handleSubmit(onSubmit, onError)}
          cancelClick={cancelClick}
          buttonDisable={!isValid}
        >
          <></>
          <Input
            register={register("note")}
            id="note"
            placeHolder="napomena"
            labelId="note"
            labelTitle="Unesite napomenu"
          />
        </GenericDialogModal>
      )}
    </>
  );
};
