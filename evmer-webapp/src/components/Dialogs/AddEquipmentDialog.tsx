import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, type Categories } from "../FormSelects/Select";
import { TextArea } from "../TextAreas/TextArea";
import { FileInput } from "../FormFileInputs/FileInput";
import { CheckBox } from "../FormCheckboxes/CheckBox";
import { useEffect } from "react";
import { DateTimePicker } from "../FormDates/DateTimePicker";
import type { Equipment } from "../../api/equipments/equipments";

interface AddEquipmentDialogProps {
  cancelClick: () => void;
  modalTitle: string;
  addData: (obj: Partial<Equipment>, file?: File) => void;
  showMenu: boolean;
  categories: Categories[];
  calibrationResults: string[];
}

const AddEquipmentSchema = z.object({
  name: z.string().trim().min(1),
  desc: z.string().trim().optional(),
  categoryId: z.number(),
  manufacturer: z.string().trim().min(1),
  manufacturerModel: z.string().trim().min(1),
  serialNumber: z.string().trim().min(1),
  purchaseYear: z.number(),
  inventoryNumber: z.string().trim().min(1),
  homeLocationDescription: z.string().trim().min(1),
  notes: z.string().trim().optional(),
  lastCalibration: z.string().optional(),
  nextCalibration: z.string().optional(),
  calibrationRequired: z.boolean(),
  calibrationResult: z.string().optional(),
  calibrationNote: z.string().optional(),
  image: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files?.[0] || files[0]?.size <= 20 * 1024 * 1024,
      "Slika ne sme biti veća od 20 MB",
    ),
  // parentId: z.number(),
});

type shemaType = z.infer<typeof AddEquipmentSchema>;

export const AddEquipmentDialog = ({
  modalTitle,
  cancelClick,
  showMenu,
  categories,
  addData,
  calibrationResults,
}: AddEquipmentDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm<shemaType>({
    resolver: zodResolver(AddEquipmentSchema),
    mode: "onChange",
    defaultValues: {
      calibrationRequired: false,
    },
  });

  useEffect(() => {
    if (!showMenu) reset();
  }, [showMenu]);

  const checkCalibration = watch("calibrationRequired");

  const onSubmit = (data: shemaType) => {
    const { image, ...dataWithoutImage } = data;
    const obj = { ...dataWithoutImage, calibrationResult: undefined };
    addData(obj, data.image ? data.image[0] : undefined);
    reset();
  };

  const onError = (formErrors: typeof errors) => {
    console.log("Forma nije validna:", formErrors);
    console.log("isValid:", isValid);
    console.log("errors:", errors);
  };

  return (
    <>
      {showMenu ? (
        <GenericDialogModal
          modalTitle={modalTitle.toUpperCase()}
          onSubmit={handleSubmit(onSubmit)}
          cancelClick={cancelClick}
          buttonDisable={!isValid}
          hasFileUpload={true}
        >
          <div>
            <div>
              <Input
                register={register("name")}
                placeHolder="Naziv opreme"
                id={"name"}
                labelId="name"
                labelTitle="Unesite naziv opreme*"
              />
            </div>
            <div>
              <TextArea
                register={register("desc")}
                id="desc"
                labelId="desc"
                labelTitle="Unesite opis"
              />
            </div>
            <div>
              <Select
                defaultValue="Odaberite kategoriju"
                register={register("categoryId", { valueAsNumber: true })}
                id="categoryId"
                optionValues={categories}
                labelId="categoryId"
                labelTitle="Odaberite kategoriju*"
              />
            </div>
            <div>
              <Input
                register={register("manufacturer")}
                id="manufacturer"
                placeHolder="Naziv proizvođača"
                labelId="manufacturer"
                labelTitle="Unesite proizvođača*"
              />
            </div>
            <div>
              <Input
                register={register("manufacturerModel")}
                id="manufacturerModel"
                placeHolder="Model proizvođača"
                labelId="manufacturerModel"
                labelTitle="Unesite model proizvođača*"
              />
            </div>
            <div>
              <Input
                register={register("serialNumber")}
                id="serialNumber"
                placeHolder="Serijski broj"
                labelId="serialNumber"
                labelTitle="Unesite serijski broj*"
              />
            </div>
            <div>
              <Input
                register={register("purchaseYear", { valueAsNumber: true })}
                id="purchaseYear"
                placeHolder="Godina kupovine"
                typeInput="number"
                labelId="purchaseYear"
                labelTitle="Unesite godinu kupovine*"
              />
            </div>
            <div>
              <Input
                register={register("inventoryNumber")}
                id="inventoryNumber"
                placeHolder="inventarski broj"
                labelId="inventoryNumber"
                labelTitle="Unesite inventarski broj*"
              />
            </div>
          </div>
          <div>
            <div>
              <Input
                register={register("homeLocationDescription")}
                id="homeLocationDescription"
                placeHolder="Lokacija"
                labelId="homeLocationDescription"
                labelTitle="Unesite lokaciju*"
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
              <CheckBox
                register={register("calibrationRequired")}
                id="calibrationRequired"
                labelId="calibrationRequired"
                labelTitle="Neophodna kalibracija?"
              />
            </div>
            <span className={checkCalibration ? "" : "hidden"}>
              <div>
                <DateTimePicker
                  id="lastCalibration"
                  register={register("lastCalibration")}
                  labelId="lastCalibration"
                  labelTitle="Unesite datum poslednje kalibracije"
                  idHours="calibrationHours"
                  idMinutes="calibrationMinutes"
                  setFormValue={(value) => setValue("lastCalibration", value)}
                  initialReset={checkCalibration ? true : false}
                />
              </div>
              <div>
                <DateTimePicker
                  id="nextCalibration"
                  register={register("nextCalibration")}
                  labelId="nextCalibration"
                  labelTitle={"Unesite datum sledeće kalibracije"}
                  idHours="calibrationHours"
                  idMinutes="calibrationMinutes"
                  setFormValue={(value) => setValue("nextCalibration", value)}
                  initialReset={checkCalibration ? true : false}
                />
              </div>
              <div>
                <Select
                  register={register("calibrationResult")}
                  id="calibrationResult"
                  defaultValue="Odaberite kalibraciju"
                  optionValues={calibrationResults}
                  labelId="calibrationResult"
                  labelTitle="Odaberite rezultat kalibracije"
                />
              </div>

              <div>
                <Input
                  register={register("calibrationNote")}
                  id="calibrationNote"
                  placeHolder="napomena kalibracije"
                  labelId="calibrationNote"
                  labelTitle="Unesite napomenu za kalibraciju"
                />
              </div>
            </span>
            <div>
              <FileInput
                register={register("image")}
                id="image"
                labelId="image"
                labelTitle="Unesite sliku"
              />
            </div>
            {/* <div>
              <label htmlFor="parentId">Unesite ?</label>
              <Input register={register("parentId")} id="parentId" placeHolder=""/>
            </div> */}
          </div>
        </GenericDialogModal>
      ) : (
        <></>
      )}
    </>
  );
};
