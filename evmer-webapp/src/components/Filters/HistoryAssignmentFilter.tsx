import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import type { AssignmentFilterProps } from "../../api/assignments/assignments";
import { Select } from "../FormSelects/Select";
import { useGlobalData } from "../../api/GlobalData";

const FilterHistoryAssignmentSchema = z.object({
  userFirstName: z.string().optional(),
  userLastName: z.string().optional(),
  equipmentName: z.string().optional(),
  eventType: z.string().optional(),
  performedAt: z.string().optional(),
});

type shemaType = z.infer<typeof FilterHistoryAssignmentSchema>;

export const HistoryAssignmentFilter = ({
  FilterItems,
  ResetItems,
}: AssignmentFilterProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<shemaType>({
    resolver: zodResolver(FilterHistoryAssignmentSchema),
    mode: "onSubmit",
  });
  const history = useGlobalData((state) => state.historyEvents);

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
          <Select
            defaultValue="Odaberite tip događaja"
            register={register("eventType", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
            id="eventType"
            optionValues={history}
            labelId="eventType"
            labelTitle="Odaberite tip događaja"
          />
        </div>
        <div>
          <DateTimePicker
            id="performedAt"
            register={register("performedAt")}
            labelId="performedAt"
            labelTitle={"Unesite datum prijavljivanja"}
            idHours="performedAtHours"
            idMinutes="performedAtMinutes"
            setFormValue={(value) => setValue("performedAt", value)}
          />
        </div>
      </GenericFilter>
    </>
  );
};
