import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { Select } from "../FormSelects/Select";
import type { EquipmentFilterProps } from "../../api/equipments/equipments";

const FilterEquipmentSchema = z.object({
  name: z.string(),
  inventoryNumber: z.string(),
  serialNumber: z.string(),
  manufacturer: z.string(),
  manufacturerModel: z.string(),
  categoryId: z.number().optional(),
  homeLocationDescription: z.string(),
});

type shemaType = z.infer<typeof FilterEquipmentSchema>;

export const EquipmentFilter = ({
  FilterItems,
  ResetItems,
  categories,
}: EquipmentFilterProps) => {
  const { register, handleSubmit, reset } = useForm<shemaType>({
    resolver: zodResolver(FilterEquipmentSchema),
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
            register={register("name")}
            id="name"
            placeHolder="naziv"
            labelId="name"
            labelTitle="Unesite naziv"
          />
        </div>
        <div>
          <Input
            register={register("inventoryNumber")}
            id="inventoryNumber"
            placeHolder="Inventarski broj"
            labelId="inventoryNumber"
            labelTitle="Unesite inventarski broj"
          />
        </div>
        <div>
          <Input
            register={register("serialNumber")}
            id="serialNumber"
            placeHolder="serijski broj"
            labelId="serialNumber"
            labelTitle="Unesite serijski broj"
          />
        </div>
        <div>
          <Input
            register={register("manufacturer")}
            id="manufacturer"
            placeHolder="Proizvođač"
            labelId="manufacturer"
            labelTitle="Unesite proizvođača"
          />
        </div>
        <div>
          <Input
            register={register("manufacturerModel")}
            id="manufacturerModel"
            placeHolder="Model proizvođača"
            labelId="manufacturerModel"
            labelTitle="Unesite model proizvođača"
          />
        </div>
        <div>
          <Select
            defaultValue="Odaberite kategoriju"
            register={register("categoryId", {
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            id="categoryId"
            optionValues={categories ? categories : []}
            labelId="categoryId"
            labelTitle="Odaberite kategoriju"
          />
        </div>
        <div>
          <Input
            register={register("homeLocationDescription")}
            id="homeLocationDescription"
            placeHolder="Lokacija"
            labelId="homeLocationDescription"
            labelTitle="Unesite lokaciju"
          />
        </div>
      </GenericFilter>
    </>
  );
};
