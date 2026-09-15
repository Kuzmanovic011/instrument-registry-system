import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect } from "react";
import type { EditProfile, User } from "../../api/users/users";

interface EditProfileDialogProps {
  cancelClick: () => void;
  profileData: User;
  editData: (data: EditProfile) => void;
}

const EditProfileSchema = z.object({
  firstName: z.string().trim().min(1, "Unesite ime"),
  lastName: z.string().trim().min(1, "Unesite prezime"),
  email: z.string().trim().email("Unesite ispravan email"),
  department: z.string().trim().min(1, "Unesite odeljenje"),
});

type EditProfileForm = z.infer<typeof EditProfileSchema>;

export const EditProfileDialog = ({
  cancelClick,
  profileData,
  editData,
}: EditProfileDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(EditProfileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      department: profileData.department,
    });
  }, [profileData, reset]);

  const onSubmit = (data: EditProfileForm) => {
    editData(data);
  };

  return (
    <GenericDialogModal
      modalTitle="IZMENI PROFIL"
      onSubmit={handleSubmit(onSubmit)}
      cancelClick={cancelClick}
      buttonDisable={!isValid}
    >
      <></>
      <div>
        <Input
          register={register("firstName")}
          id="firstName"
          placeHolder="Ime"
          labelId="firstName"
          labelTitle="Ime*"
          autoCompleteTxt="text"
        />

        <Input
          register={register("lastName")}
          id="lastName"
          placeHolder="Prezime"
          labelId="lastName"
          labelTitle="Prezime*"
          autoCompleteTxt="text"
        />

        <Input
          register={register("email")}
          id="email"
          placeHolder="Email"
          labelId="email"
          labelTitle="Email*"
          autoCompleteTxt="email"
        />

        <Input
          register={register("department")}
          id="department"
          placeHolder="Odeljenje"
          labelId="department"
          labelTitle="Odeljenje*"
          autoCompleteTxt="text"
        />
      </div>
    </GenericDialogModal>
  );
};
