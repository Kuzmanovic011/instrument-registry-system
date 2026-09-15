import { GenericDialogModal } from "./GenericDialogModal";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import { Select } from "../FormSelects/Select";
import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { addCalibrationEquipmentProps } from "../../api/equipments/equipments";

interface AddCalibrationProps {
  cancelClick: () => void;
  showMenu: boolean;
  calibrationResults: string[];
  idEquipment: number;
  addCalibration: (id: number, data: addCalibrationEquipmentProps) => void;
}

const AddCalibrationSchema = z.object({
  lastCalibration: z.string().optional(),
  nextCalibration: z.string().optional(),
  calibrationResult: z.string().min(1),
  calibrationNote: z.string().optional(),
  // parentId: z.number(),
});

type shemaType = z.infer<typeof AddCalibrationSchema>;

export const AddCalibrationDialog = ({
  showMenu,
  cancelClick,
  calibrationResults,
  idEquipment,
  addCalibration,
}: AddCalibrationProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(AddCalibrationSchema),
    mode: "onChange",
    defaultValues: {
      calibrationResult: "",
    },
  });

  const onSubmit = (data: shemaType) => {
    addCalibration(idEquipment, data);
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
          modalTitle="Dodavanje kalibracije"
          cancelClick={cancelClick}
          buttonDisable={!isValid}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <DateTimePicker
            id="lastCalibration"
            register={register("lastCalibration")}
            labelId="lastCalibration"
            labelTitle="Unesite datum poslednje kalibracije"
            idHours="calibrationHours"
            idMinutes="calibrationMinutes"
            setFormValue={(value) => setValue("lastCalibration", value)}
          />
          <DateTimePicker
            id="nextCalibration"
            register={register("nextCalibration")}
            labelId="nextCalibration"
            labelTitle={"Unesite datum sledeće kalibracije"}
            idHours="calibrationHours"
            idMinutes="calibrationMinutes"
            setFormValue={(value) => setValue("nextCalibration", value)}
          />
          <Select
            register={register("calibrationResult")}
            id="calibrationResult"
            defaultValue="Odaberite kalibraciju"
            optionValues={calibrationResults}
            labelId="calibrationResult"
            labelTitle="Odaberite rezultat kalibracije"
          />
          <Input
            register={register("calibrationNote")}
            id="calibrationNote"
            placeHolder="napomena kalibracije"
            labelId="calibrationNote"
            labelTitle="Unesite napomenu za kalibraciju"
          />
        </GenericDialogModal>
      )}
    </>
  );
};
