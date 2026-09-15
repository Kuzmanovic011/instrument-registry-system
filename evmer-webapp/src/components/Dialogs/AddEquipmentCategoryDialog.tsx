import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import type { AddEquipmentCategoryDialogProps } from "../../api/equipments/equipments";

const AddEquipmentCategorySchema = z.object({
  name: z.string().min(1),
  desc: z.string(),
});

type shemaType = z.infer<typeof AddEquipmentCategorySchema>;

export const AddEquipmentCategoryDialog = ({
  cancelClick,
  showMenu,
  AddEquipmentCategory,
}: AddEquipmentCategoryDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(AddEquipmentCategorySchema),
    mode: "onChange",
  });

  const onSubmit = (data: shemaType) => {
    AddEquipmentCategory(data);
    reset();
  };

  const onError = (formErrors: typeof errors) => {
    console.log("Forma nije validna:", formErrors);
  };

  return (
    <>
      {showMenu && (
        <GenericDialogModal
          modalTitle="Dodavanje kategorije"
          onSubmit={handleSubmit(onSubmit, onError)}
          cancelClick={cancelClick}
          buttonDisable={!isValid}
        >
          <div>
            <Input
              register={register("name")}
              id="name"
              placeHolder="naziv kategorije"
              labelId="name"
              labelTitle="Unesite naziv kategorije*"
            />
          </div>
          <div>
            <Input
              register={register("desc")}
              id="desc"
              placeHolder="opis kategorije"
              labelId="desc"
              labelTitle="Unesite opis kategorije"
            />
          </div>
        </GenericDialogModal>
      )}
    </>
  );
};
