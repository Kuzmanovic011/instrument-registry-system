import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import type { ChangePasswordRequest } from "../../api/users/users";

interface ChangePasswordDialogProps {
  cancelClick: () => void;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
}

const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().trim().min(1, "Unesite staru lozinku"),
    newPassword1: z.string().trim().min(1, "Unesite novu lozinku"),
    newPassword2: z.string().trim().min(1, "Potvrdite novu lozinku"),
  })
  .refine((data) => data.newPassword1 === data.newPassword2, {
    message: "Nove lozinke se ne poklapaju",
    path: ["newPassword2"],
  });

type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

export const ChangePasswordDialog = ({
  cancelClick,
  changePassword,
}: ChangePasswordDialogProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      setErrorMessage("");

      await changePassword(data);

      reset();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data || "Greška prilikom promene lozinke",
      );
    }
  };

  return (
    <GenericDialogModal
      modalTitle="PROMENI LOZINKU"
      onSubmit={handleSubmit(onSubmit)}
      cancelClick={cancelClick}
      buttonDisable={!isValid}
    >
      <></>
      <div>
        <Input
          register={register("oldPassword")}
          id="oldPassword"
          typeInput="password"
          placeHolder="Stara lozinka"
          labelId="oldPassword"
          labelTitle="Unesite staru lozinku*"
          autoCompleteTxt="current-password"
        />

        <Input
          register={register("newPassword1")}
          id="newPassword1"
          typeInput="password"
          placeHolder="Nova lozinka"
          labelId="newPassword1"
          labelTitle="Unesite novu lozinku*"
          autoCompleteTxt="new-password"
        />

        <Input
          register={register("newPassword2")}
          id="newPassword2"
          typeInput="password"
          placeHolder="Ponovite novu lozinku"
          labelId="newPassword2"
          labelTitle="Ponovite novu lozinku*"
          autoCompleteTxt="new-password"
        />

        {errors.newPassword2 && (
          <p className="text-red-500">{errors.newPassword2.message}</p>
        )}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </GenericDialogModal>
  );
};
