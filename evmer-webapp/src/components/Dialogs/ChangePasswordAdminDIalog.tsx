import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import type { ChangePasswordAdminRequest } from "../../api/users/users";

interface ChangePasswordAdminDialogProps {
  cancelClick: () => void;
  changePassword: (data: ChangePasswordAdminRequest) => Promise<void>;
}

const ChangePasswordAdminSchema = z
  .object({
    newPassword1: z.string().trim().min(1, "Unesite novu lozinku"),
    newPassword2: z.string().trim().min(1, "Potvrdite novu lozinku"),
  })
  .refine((data) => data.newPassword1 === data.newPassword2, {
    message: "Nove lozinke se ne poklapaju",
    path: ["newPassword2"],
  });

type ChangePasswordAdminForm = z.infer<
  typeof ChangePasswordAdminSchema
>;

export const ChangePasswordAdminDialog = ({
  cancelClick,
  changePassword,
}: ChangePasswordAdminDialogProps) => {
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ChangePasswordAdminForm>({
    resolver: zodResolver(ChangePasswordAdminSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ChangePasswordAdminForm) => {
    try {
      setErrorMessage("");

      await changePassword(data);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data ||
          "Greška prilikom promene lozinke"
      );
    }
  };

  return (
    <GenericDialogModal
      modalTitle="PROMENI LOZINKU KORISNIKA"
      onSubmit={handleSubmit(onSubmit)}
      cancelClick={cancelClick}
      buttonDisable={!isValid}
    >
        <></>
      <div>
        <Input
          register={register("newPassword1")}
          id="newPassword1"
          typeInput="password"
          placeHolder="Nova lozinka"
          labelId="newPassword1"
          labelTitle="Unesite novu lozinku*"
        />

        <Input
          register={register("newPassword2")}
          id="newPassword2"
          typeInput="password"
          placeHolder="Ponovite novu lozinku"
          labelId="newPassword2"
          labelTitle="Ponovite novu lozinku*"
        />

        {errors.newPassword2 && (
          <p className="text-red-500">
            {errors.newPassword2.message}
          </p>
        )}

        {errorMessage && (
          <p className="text-red-500 mt-2">
            {errorMessage}
          </p>
        )}
      </div>
    </GenericDialogModal>
  );
};