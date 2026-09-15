import { GenericDialogModal } from "./GenericDialogModal";
import { type GenericDialogModalProps } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "../FormSelects/Select";
import { TextArea } from "../TextAreas/TextArea";
import { FileInput } from "../FormFileInputs/FileInput";
import type { Equipment } from "../../api/equipments/equipments";

interface EditEquipmentDialogProps extends GenericDialogModalProps<Equipment> {
  editData: (obj: Partial<Equipment>, file?: File) => void;
  statuses: string[];
}

const EditEquipmentSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1, "Morate uneti nesto..."),
  status: z.string(),
  desc: z.string().trim(),
  homeLocationDescription: z.string().trim(),
  notes: z.string().trim(),
  image: z.instanceof(FileList).optional(),
});

type shemaType = z.infer<typeof EditEquipmentSchema>;

export const EditEquipmentDialog = ({
  cancelClick,
  modalTitle = "TITLE",
  rowData,
  editData,
  statuses,
}: EditEquipmentDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(EditEquipmentSchema),
    mode: "onChange",
    defaultValues: {
      id: rowData ? rowData.id : undefined,
      name: rowData ? rowData.name : undefined,
      status: rowData ? rowData.status : undefined,
      desc: rowData ? rowData.desc : undefined,
      notes: rowData ? rowData.notes : undefined,
      homeLocationDescription: rowData
        ? rowData.homeLocationDescription
        : undefined,
      image: undefined,
    },
  });

  const onSubmit = (data: shemaType) => {
    const { image, ...dataWithoutImage } = data;
    if (data.image?.[0]) editData(dataWithoutImage, data.image?.[0]);
    else editData(dataWithoutImage);
  };

  return rowData ? (
    <GenericDialogModal
      modalTitle={modalTitle.toUpperCase()}
      onSubmit={handleSubmit(onSubmit)}
      cancelClick={cancelClick}
      rowData={rowData}
      buttonDisable={!isValid}
      hasFileUpload={true}
    >
      <div className="hidden">
        <Input
          register={register("id", { valueAsNumber: true })}
          typeInput="hidden"
          placeHolder=""
          labelId=""
          labelTitle=""
        />
      </div>
      <div>
        <Input
          register={register("name")}
          placeHolder="Naziv opreme"
          id={"name"}
          labelId="name"
          labelTitle="Unesite naziv opreme"
        />

        <div>
          <Input
            register={register("homeLocationDescription")}
            id="homeLocationDescription"
            placeHolder="Lokacija"
            labelId="homeLocationDescription"
            labelTitle="Unesite lokaciju"
          />
        </div>
        <div>
          <Select
            register={register("status")}
            id="status"
            defaultValue="Odaberite status"
            optionValues={statuses}
            labelId="status"
            labelTitle="Odaberite status"
          />
        </div>
      </div>
      <div>
        <div>
          <TextArea
            register={register("desc")}
            id="desc"
            labelId="desc"
            labelTitle="Unesite opis"
          />
        </div>
        <div>
          <TextArea
            register={register("notes")}
            id="notes"
            labelId="notes"
            labelTitle="Unesite napomenu"
          />
        </div>
        <div>
          <FileInput
            register={register("image")}
            id="image"
            labelId="image"
            labelTitle="Unesite sliku"
          />
        </div>
      </div>
    </GenericDialogModal>
  ) : (
    <></>
  );
};
