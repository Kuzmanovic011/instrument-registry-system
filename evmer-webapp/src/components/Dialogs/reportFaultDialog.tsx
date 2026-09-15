import { GenericDialogModal } from "./GenericDialogModal";
import { Select } from "../FormSelects/Select";
import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGlobalData } from "../../api/GlobalData";
import type { ReportFaultDialogProps } from "../../api/faultReports/faultReports";

const ReportFaultSchema = z.object({
  desc: z.string(),
  severity: z.string(),
  reportType: z.string(),
});

type shemaType = z.infer<typeof ReportFaultSchema>;

export const ReportFaultDialog = ({
  showMenu,
  cancelClick,
  reportFault,
  idFaultReport,
}: ReportFaultDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(ReportFaultSchema),
    mode: "onChange",
    defaultValues: {
      desc: "",
      severity: "",
    },
  });

  const reportFaultGlobal = useGlobalData((state) => state.faultReport);
  const onSubmit = (data: shemaType) => {
    if (idFaultReport === undefined) return;
    reportFault(idFaultReport, data);
    reset();
  };
  
  return (
    <>
      {showMenu && (
        <GenericDialogModal
          modalTitle="Prijavi kvar"
          cancelClick={cancelClick}
          buttonDisable={!isValid}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            register={register("desc")}
            id="desc"
            placeHolder="Opis kvara"
            labelId="desc"
            labelTitle="Unesite opis"
          />
          <Input
            register={register("severity")}
            id="severity"
            placeHolder="Ozbiljnost kvara"
            labelId="severity"
            labelTitle="Unesite ozbiljnost kvara"
          />
          <Select
            defaultValue="Odaberite tip"
            register={register("reportType")}
            id="reportType"
            optionValues={reportFaultGlobal ?? []}
            labelId="reportType"
            labelTitle="Odaberite tip*"
          />
        </GenericDialogModal>
      )}
    </>
  );
};
