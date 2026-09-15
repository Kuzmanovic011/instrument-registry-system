import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import type { AssignEquipmentRequest } from "../../api/equipments/equipments";

interface AssignEquipmentDialogProps {
  idAssignment: number | undefined;
  cancelClick: () => void;
  modalTitle: string;
  assignData: (id: number, obj: AssignEquipmentRequest) => void;
  showMenu: boolean;
}

const AssignEquipmentSchema = z.object({
  projectOrTask: z.string().min(1),
  assignmentNote: z.string().optional(),
});
type shemaType = z.infer<typeof AssignEquipmentSchema>;

export const AssignEquipmentDialog = ({
  showMenu,
  cancelClick,
  idAssignment,
  assignData,
}: AssignEquipmentDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(AssignEquipmentSchema),
    mode: "onChange",
    defaultValues: {
      projectOrTask: "",
      assignmentNote: "",
    },
  });

  const onSubmit = (data: shemaType) => {
    if (idAssignment === undefined) return;
    assignData(idAssignment, data);
    reset();
  };

  const onError = (formErrors: typeof errors) => {
    console.log("Forma nije validna:", formErrors);
    console.log("isValid:", isValid);
    console.log("errors:", errors);
  };

  return (
    <>
      {showMenu && (
        <GenericDialogModal
          modalTitle="Zaduženje opreme"
          cancelClick={cancelClick}
          buttonDisable={!isValid}
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          <Input
            register={register("projectOrTask")}
            id="projectOrTask"
            placeHolder="Projekat/zadatak"
            labelId="projectOrTask"
            labelTitle="Unesite projekat/zadatak*"
          />
          <Input
            register={register("assignmentNote")}
            id="assignmentNote"
            placeHolder="Napomena za zaduženje"
            labelId="assignmentNote"
            labelTitle="Unesite napomenu za zaduženje"
          />
        </GenericDialogModal>
      )}
    </>
  );
};
