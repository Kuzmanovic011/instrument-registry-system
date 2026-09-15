import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect } from "react";
import { Select } from "../FormSelects/Select"; 
import type { User, UserEdit } from "../../api/users/users";

interface EditUserDialogProps {
  cancelClick: () => void;
  rowData: User;
  editData: (id: number, data: UserEdit) => void;
  userRoles: string[];
}

const EditUserSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  username: z.string().trim().min(1),
  email: z.string().trim().email(),
  department: z.string().trim().min(1),
  userRoles: z.string().min(1),
})

type EditUserForm = z.infer<typeof EditUserSchema>;

export const EditUserDialog = ({
  cancelClick,
  rowData,
  editData,
  userRoles,  
}: EditUserDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<EditUserForm>({
    resolver: zodResolver(EditUserSchema),
    mode: "onChange",
  })

  useEffect(() => {
    reset({
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      username: rowData.username,
      email: rowData.email,
      department: rowData.department,
      userRoles: rowData.role,
    })
  }, [rowData, reset])

  const onSubmit = (data: EditUserForm) => {
    editData(rowData.id, data);
  }

  return (
    <GenericDialogModal
      modalTitle="IZMENI KORISNIKA"
      onSubmit={handleSubmit(onSubmit)}
      cancelClick={cancelClick}
      buttonDisable={!isValid}
    >
      <div>
        <Input
          register={register("firstName")}
          id="firstName"
          placeHolder="Ime"
          labelId="firstName"
          labelTitle="Ime*"
        />

        <Input
          register={register("lastName")}
          id="lastName"
          placeHolder="Prezime"
          labelId="lastName"
          labelTitle="Prezime*"
        />

        <Input
          register={register("username")}
          id="username"
          placeHolder="Korisničko ime"
          labelId="username"
          labelTitle="Korisničko ime*"
        />

        <Input
          register={register("email")}
          id="email"
          placeHolder="Email"
          labelId="email"
          labelTitle="Email*"
        />
      </div>

      <div>
        <Input
          register={register("department")}
          id="department"
          placeHolder="Odeljenje"
          labelId="department"
          labelTitle="Odeljenje*"
        />
      </div>
      <Select
        register={register("userRoles")}
        id="role"
        defaultValue="Odaberite ulogu"
        optionValues={userRoles}
        labelId="role"
        labelTitle="Uloga*"
      />
    </GenericDialogModal>
  )
}