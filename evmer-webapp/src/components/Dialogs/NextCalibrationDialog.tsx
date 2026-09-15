import { GenericDialogModal } from "./GenericDialogModal";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface NextCalibrationProps {
  cancelClick: () => void;
  showMenu: boolean;
  idEquipment?: number;
  ScheduleNextCalibration: (id: number, data: {date: string}) => void;
}

const NextCalibrationSchema = z.object({
  date: z.string().min(1),
});

type shemaType = z.infer<typeof NextCalibrationSchema>;

export const NextCalibrationDialog = ({
  showMenu,
  cancelClick,
  ScheduleNextCalibration,
  idEquipment,
}: NextCalibrationProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(NextCalibrationSchema),
    mode: "onChange",
    defaultValues: {
      date: "",
    },
  });

  const onSubmit = (data: shemaType) => {
    if (idEquipment) ScheduleNextCalibration(idEquipment, data);
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
          modalTitle="Zakazivanje kalibracije"
          cancelClick={cancelClick}
          buttonDisable={!isValid}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <DateTimePicker
            id="date"
            register={register("date")}
            labelId="date"
            labelTitle={"Unesite datum zakazivanja kalibracije"}
            idHours="calibrationHours"
            idMinutes="calibrationMinutes"
            setFormValue={(value) =>
              setValue("date", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
          {null}
        </GenericDialogModal>
      )}
    </>
  );
};
