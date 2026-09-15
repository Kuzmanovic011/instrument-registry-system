import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import { Select } from "../FormSelects/Select";
import { useGlobalData } from "../../api/GlobalData";
import type { Unassign } from "../../api/equipments/equipments";

interface UnassignEquipmentDialogProps {
  idUnassignment: number | undefined;
  cancelClick: () => void;
  modalTitle: string;
  unassignData: (id: number, obj: Unassign) => void;
  showMenu: boolean;
}

const UnassignEquipmentSchema = z.object({
  desc: z.string(),
  severity: z.string(),
  returnNote: z.string(),
  returnCondition: z.string(),
});
type shemaType = z.infer<typeof UnassignEquipmentSchema>;

export const UnassignEquipmentDialog = ({
  showMenu,
  cancelClick,
  idUnassignment,
  unassignData,
}: UnassignEquipmentDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(UnassignEquipmentSchema),
    mode: "onChange",
    defaultValues: {
      desc: "",
      severity: "",
      returnNote: "",
      returnCondition: "",
    },
  });
  const returnGlobalConditions = useGlobalData(
    (state) => state.returnConditions,
  );

  const onSubmit = (data: shemaType) => {
    if (idUnassignment === undefined) return;
    unassignData(idUnassignment, data);
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
          modalTitle="Razduženje opreme"
          cancelClick={cancelClick}
          buttonDisable={!isValid}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <Input
            register={register("desc")}
            id="desc"
            placeHolder="Opis"
            labelId="desc"
            labelTitle="Unesite opis"
          />
          <Input
            register={register("severity")}
            id="severity"
            placeHolder="Ozbiljnost"
            labelId="severity"
            labelTitle="Unesite ozbiljnost kvara"
          />
          <Input
            register={register("returnNote")}
            id="returnNote"
            placeHolder="Napomena za razduženje"
            labelId="returnNote"
            labelTitle="Unesite napomenu za razduženje"
          />
          <Select
            defaultValue="Odaberite stanje"
            register={register("returnCondition")}
            id="returnCondition"
            optionValues={returnGlobalConditions}
            labelId="returnCondition"
            labelTitle="Odaberite stanje pri razduženju*"
          />
        </GenericDialogModal>
      )}
    </>
  );
};
