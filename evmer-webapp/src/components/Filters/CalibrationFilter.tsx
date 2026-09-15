import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import { Select } from "../FormSelects/Select";
import { useState } from "react";
import type { CalibrationFilterProps } from "../../api/calibrations/calibrations";

const FilterCalibrationSchema = z.object({
  name: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  calibrationStatus: z.string().optional(),
});

type shemaType = z.infer<typeof FilterCalibrationSchema>;

export const CalibrationFilter = ({
  FilterItems,
  ResetItems,
  statuses,
}: CalibrationFilterProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<shemaType>({
    resolver: zodResolver(FilterCalibrationSchema),
    mode: "onSubmit",
  });

  const [resetDateTime, setResetDateTime] = useState(0);

  function onSubmit(data: shemaType) {
    console.log(data);
    FilterItems(data);
    reset();
    setResetDateTime((prev) => prev + 1);
  }

  return (
    <>
      <GenericFilter
        ResetItems={() => {
          setResetDateTime((prev) => prev + 1);

          ResetItems();
          reset();
        }}
        ButtonDisable={false}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Input
            register={register("name")}
            id="name"
            placeHolder="Naziv"
            labelId="name"
            labelTitle="Unesite naziv opreme"
          />
        </div>
        <div>
          <Select
            defaultValue="Odaberite status"
            register={register("calibrationStatus", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
            id="calibrationStatus"
            optionValues={statuses}
            labelId="calibrationStatus"
            labelTitle="Odaberite status kalibracije"
          />
        </div>
        <div>
          <DateTimePicker
            key={`to-${resetDateTime}`}
            id="from"
            register={register("from")}
            labelId="from"
            labelTitle={"Unesite početni datum kalibracije"}
            setFormValue={(value) => setValue("from", value)}
            initialReset={resetDateTime}
          />
        </div>
        <div>
          <DateTimePicker
            key={`to-${resetDateTime}`}
            id="to"
            register={register("to")}
            labelId="to"
            labelTitle={"Unesite krajnji datum kalibracije"}
            setFormValue={(value) => setValue("to", value)}
            initialReset={resetDateTime}
          />
        </div>
      </GenericFilter>
    </>
  );
};
