import { Input } from "../FormInputs/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericFilter } from "./GenericFilter";
import { Select } from "../FormSelects/Select";
import type { UserFilterProps } from "../../api/users/users";

const FilterUserSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  username: z.string().trim(),
  email: z.string().trim(),
  role: z.string().trim().optional(),
  department: z.string().trim(),
});

type shemaType = z.infer<typeof FilterUserSchema>;

export const UserFilter = ({
  FilterItems,
  ResetItems,
  roles,
}: UserFilterProps) => {
  const { register, handleSubmit, reset } = useForm<shemaType>({
    resolver: zodResolver(FilterUserSchema),
    mode: "onSubmit",
  });

  function onSubmit(data: shemaType) {
    FilterItems(data);
    reset();
  }
  return (
    <>
      <GenericFilter
        ResetItems={ResetItems}
        ButtonDisable={false}
        onSubmit={handleSubmit(onSubmit)}
        ResetFields={() => reset()}
      >
        <div>
          <Input
            register={register("firstName")}
            id="firstName"
            placeHolder="Ime"
            labelId="firstName"
            labelTitle="Unesite ime"
          />
        </div>
        <div>
          <Input
            register={register("lastName")}
            id="lastName"
            placeHolder="Prezime"
            labelId="lastName"
            labelTitle="Unesite prezime"
          />
        </div>
        <div>
          <Input
            register={register("username")}
            id="username"
            placeHolder="Korisničko ime"
            labelId="username"
            labelTitle="Unesite korisničko ime"
          />
        </div>
        <div>
          <Input
            register={register("email")}
            id="email"
            placeHolder="Mejl adresa"
            labelId="email"
            labelTitle="Unesite mejl adresu"
          />
        </div>
        <div>
          <Input
            register={register("department")}
            id="department"
            placeHolder="Odeljenje"
            labelId="department"
            labelTitle="Unesite odeljenje"
          />
        </div>
        <div>
          <Select
            defaultValue="Odaberite ulogu"
            register={register("role")}
            id="role"
            optionValues={roles ? roles : []}
            labelId="role"
            labelTitle="Odaberite ulogu"
          />
        </div>
      </GenericFilter>
    </>
  );
};
