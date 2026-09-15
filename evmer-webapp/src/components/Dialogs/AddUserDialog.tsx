import { GenericDialogModal } from "./GenericDialogModal";
import { Input } from "../FormInputs/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Select } from "../FormSelects/Select";
import { useGlobalData } from "../../api/GlobalData";
import type { UserRequest } from "../../api/users/users";

interface AddUserDialogProps {
  cancelClick: () => void
  showMenu: boolean
  addData: (data: UserRequest) => void
}

const AddUserSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  username: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(1),
  role: z.string().min(1),
  department: z.string().trim().min(1),
})

type AddUserForm = z.infer<typeof AddUserSchema>


export const AddUserDialog = ({
  cancelClick,
  showMenu,
  addData,
}: AddUserDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<AddUserForm>({
    resolver: zodResolver(AddUserSchema),
    mode: "onChange",
  })

  const userRoles = useGlobalData(
    (state) => state.userRoles,
  );
  const onSubmit = (data: AddUserForm) => {
    addData(data);
    reset();
  }

  return (
    <>
      {showMenu && (
        <GenericDialogModal
          modalTitle="DODAJ KORISNIKA"
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
              labelTitle="Unesite ime*"
            />

            <Input
              register={register("lastName")}
              id="lastName"
              placeHolder="Prezime"
              labelId="lastName"
              labelTitle="Unesite prezime*"
            />

            <Input
              register={register("username")}
              id="username"
              placeHolder="Korisničko ime"
              labelId="username"
              labelTitle="Unesite korisničko ime*"
            />

            <Input
              register={register("email")}
              id="email"
              placeHolder="Email"
              labelId="email"
              labelTitle="Unesite email*"
            />
          </div>

          <div>
            <Input
              register={register("password")}
              id="password"
              typeInput="password"
              placeHolder="Lozinka"
              labelId="password"
              labelTitle="Unesite lozinku*"
            />

            <Select
              register={register("role")}
              id="role"
              defaultValue = "Odaberite ulogu"
              optionValues={userRoles}
              labelId="role"
              labelTitle="Odaberite ulogu*"
            />

            <Input
              register={register("department")}
              id="department"
              placeHolder="Odeljenje"
              labelId="department"
              labelTitle="Unesite odeljenje*"
            />
          </div>
        </GenericDialogModal>
      )}
    </>
  )
}