import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import type {
  ReportFilterProps,
  FilterFaultProps,
} from "../../api/faultReports/faultReports";

const FilterFaultSchema = z.object({
  equipmentName: z.string().optional(),
  userFirstName: z.string().optional(),
  userLastName: z.string().optional(),
  reportedAt: z.string().optional(),
  severity: z.string().optional(),
  status: z.string().optional(),
});

type shemaType = z.infer<typeof FilterFaultSchema>;

export const FaultFilter = ({ FilterItems, ResetItems }: ReportFilterProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<shemaType>({
    resolver: zodResolver(FilterFaultSchema),
    mode: "onSubmit",
  });

  function onSubmit(data: shemaType) {
    const filterData: FilterFaultProps = {
      ...data,
      status:
        data.status === "Rešen"
          ? false
          : data.status === "Aktivan"
            ? true
            : undefined,
    };

    FilterItems(filterData);
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
            register={register("equipmentName")}
            id="equipmentName"
            placeHolder="naziv"
            labelId="equipmentName"
            labelTitle="Unesite naziv"
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
            placeHolder="Unesite prezime korisnika"
            labelId="userLastName"
            labelTitle="Unesite prezime korisnika"
          />
        </div>
        <div>
          <DateTimePicker
            id="reportedAt"
            register={register("reportedAt")}
            labelId="reportedAt"
            labelTitle={"Unesite datum prijavljivanja"}
            idHours="reportedAtHours"
            idMinutes="reportedAtMinutes"
            setFormValue={(value) => setValue("reportedAt", value)}
          />
        </div>
        <div>
          <Input
            register={register("severity")}
            id="severity"
            placeHolder="Unesite stepen kvara"
            labelId="severity"
            labelTitle="Unesite stepen kvara"
          />
        </div>
        <div>
          <Input
            register={register("status")}
            id="status"
            placeHolder="Unesite status kvara"
            labelId="status"
            labelTitle="Unesite status kvara"
          />
        </div>
      </GenericFilter>
    </>
  );
};
