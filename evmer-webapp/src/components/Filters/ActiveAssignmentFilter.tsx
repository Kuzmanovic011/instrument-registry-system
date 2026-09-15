import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import type { AssignmentFilterProps } from "../../api/assignments/assignments";

const FilterActiveAssignmentSchema = z.object({
  userFirstName: z.string().optional(),
  userLastName: z.string().optional(),
  equipmentName: z.string().optional(),
  projectOrTask: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

type shemaType = z.infer<typeof FilterActiveAssignmentSchema>;

export const ActiveAssignmentFilter = ({
  FilterItems,
  ResetItems,
}: AssignmentFilterProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<shemaType>({
    resolver: zodResolver(FilterActiveAssignmentSchema),
    mode: "onSubmit",
  });

  function onSubmit(data: shemaType) {
    FilterItems(data);
    reset();
  }

  return (
    <>
      <GenericFilter
        ResetItems={ResetItems}
        ButtonDisable={false}
        onSubmit={handleSubmit(onSubmit)}
        ResetFields={() => reset()}
      >
        <div>
          <Input
            register={register("userFirstName")}
            id="userFirstName"
            placeHolder="Ime korisnika"
            labelId="userFirstName"
            labelTitle="Unesite ime korisnika"
          />
        </div>
        <div>
          <Input
            register={register("userLastName")}
            id="userLastName"
            placeHolder="Prezime korisnika"
            labelId="userLastName"
            labelTitle="Unesite prezime korisnika"
          />
        </div>
        <div>
          <Input
            register={register("equipmentName")}
            id="equipmentName"
            placeHolder="Naziv opreme"
            labelId="equipmentName"
            labelTitle="Unesite naziv opreme"
          />
        </div>
        <div>
          <Input
            register={register("projectOrTask")}
            id="projectOrTask"
            placeHolder="Projekat ili zadatak"
            labelId="projectOrTask"
            labelTitle="Unesite projekat ili zadatak"
          />
        </div>
        <div>
          <DateTimePicker
            id="from"
            register={register("from")}
            labelId="from"
            labelTitle={"Unesite početni datum zaduženja"}
            idHours="fromAtHours"
            idMinutes="fromAtMinutes"
            setFormValue={(value) => setValue("from", value)}
          />
        </div>
        <div>
          <DateTimePicker
            id="to"
            register={register("to")}
            labelId="to"
            labelTitle={"Unesite krajnji datum zaduženja"}
            idHours="toAtHours"
            idMinutes="toAtMinutes"
            setFormValue={(value) => setValue("to", value)}
          />
        </div>
      </GenericFilter>
    </>
  );
};
