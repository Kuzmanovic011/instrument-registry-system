import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { Select } from "../FormSelects/Select";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import type { HistoryFilterProps } from "../../api/histories/histories";
import { useState } from "react";

const FilterHistorySchema = z.object({
  equipmentName: z.string().trim(),
  userFirstName: z.string().trim(),
  userLastName: z.string().trim(),
  eventType: z.string().trim(),
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
});

type shemaType = z.infer<typeof FilterHistorySchema>;

export const HistoryFilter = ({
  FilterItems,
  ResetItems,
  type,
}: HistoryFilterProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<shemaType>({
    resolver: zodResolver(FilterHistorySchema),
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
          ResetItems();
          setResetDateTime((prev) => prev + 1);
        }}
        ButtonDisable={false}
        onSubmit={handleSubmit(onSubmit)}
        ResetFields={() => {
          reset();
          setResetDateTime((prev) => prev + 1);
        }}
      >
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
          <Select
            defaultValue="Odaberite tip događaja"
            register={register("eventType")}
            id="eventType"
            optionValues={type ? type : []}
            labelId="eventType"
            labelTitle="Odaberite tip događaja"
          />
        </div>
        <div>
          <DateTimePicker
            id="from"
            register={register("from")}
            labelId="from"
            labelTitle="Unesite početni datum"
            setFormValue={(value) => setValue("from", value)}
            initialReset={resetDateTime}
          />
        </div>
        <div>
          <DateTimePicker
            id="to"
            register={register("to")}
            labelId="to"
            labelTitle="Unesite krajnji datum"
            setFormValue={(value) => setValue("to", value)}
            initialReset={resetDateTime}
          />
        </div>
      </GenericFilter>
    </>
  );
};
