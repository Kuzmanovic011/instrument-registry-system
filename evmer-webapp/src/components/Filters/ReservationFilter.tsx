import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import {
  reservationStatusOptions,
  type ReservationFilterProps,
} from "../../api/reservations/reservations";
import { Select } from "../FormSelects/Select";
import { useState } from "react";

const FilterReservationSchema = z.object({
  equipmentName: z.string().optional(),
  userFirstName: z.string().optional(),
  userLastName: z.string().optional(),
  status: z.enum(["AKTIVNA", "REALIZOVANA", "OTKAZANA", "ISTEKLA"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

type shemaType = z.infer<typeof FilterReservationSchema>;

export const ReservationFilter = ({
  FilterItems,
  ResetItems,
}: ReservationFilterProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<shemaType>({
    resolver: zodResolver(FilterReservationSchema),
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
            defaultValue="Odaberite status"
            register={register("status", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
            id="status"
            optionValues={reservationStatusOptions}
            labelId="status"
            labelTitle="Odaberite status"
          />
        </div>
        <div>
          <DateTimePicker
            key={`to-${resetDateTime}`}
            id="from"
            register={register("from")}
            labelId="from"
            labelTitle={"Unesite početni datum zaduženja"}
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
            labelTitle={"Unesite krajnji datum zaduženja"}
            setFormValue={(value) => setValue("to", value)}
            initialReset={resetDateTime}
          />
        </div>
      </GenericFilter>
    </>
  );
};
