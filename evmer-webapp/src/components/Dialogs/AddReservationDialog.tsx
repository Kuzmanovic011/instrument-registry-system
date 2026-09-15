import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { AddReservationRequest } from "../../api/reservations/reservations";
import { reqNumReservations } from "../../api/equipments/equipments";

interface AddReservationProps {
  cancelClick: () => void;
  showMenu: boolean;
  modalTitle: string;
  idEquipment: number | undefined;
  addReservation: (id: number, data: AddReservationRequest) => void;
}

const AddReservationSchema = z.object({
  note: z.string().optional(),
});

type shemaType = z.infer<typeof AddReservationSchema>;

export const AddReservationDialog = ({
  showMenu,
  cancelClick,
  idEquipment,
  addReservation,
}: AddReservationProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(AddReservationSchema),
    mode: "onSubmit",
    defaultValues: {
      note: "",
    },
  });

  const [resNum, setReservationNumber] = useState<number>(0);

  useEffect(() => {
    const getReservationNumber = async () => {
      let num: number = 0;
      if (idEquipment != undefined) num = await reqNumReservations(idEquipment);
      setReservationNumber(num);
    };
    getReservationNumber();
  }, [idEquipment]);

  const onSubmit = (data: shemaType) => {
    if (idEquipment === undefined) return;
    addReservation(idEquipment, data);
    reset();
  };

  return (
    <>
      {showMenu && (
        <>
          <GenericDialogModal
            modalTitle="Dodavanje rezervacije"
            cancelClick={cancelClick}
            buttonDisable={!isValid}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              register={register("note")}
              id="note"
              placeHolder="Napomena za rezervaciju"
              labelId="note"
              labelTitle="Unesite napomenu za rezervaciju"
            />
            <div>
              <p>Broj ljudi koji ceka rezervaciju: {resNum}</p>
            </div>
          </GenericDialogModal>
        </>
      )}
    </>
  );
};
