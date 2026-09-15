import { Input } from "../components/FormInputs/Input.tsx";
import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { Form } from "../components/Forms/Form";
import "../style.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveCredentials } from "../scripts/Session.ts";
import { useNavigate } from "react-router";
import { assetUrl } from "../config/paths.ts";
import { useToastStore } from "../api/ToastStore";
import { reqLoginInto } from "../api/users/users.ts";

const loginShema = z.object({
  username: z.string().min(1, { message: "Morate uneti ime" }),
  password: z.string().min(1, { message: "Morate uneti lozinku" }),
});

type shemaType = z.infer<typeof loginShema>;

export const LoginV = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<shemaType>({
    resolver: zodResolver(loginShema),
    mode: "onChange",
  });

  const onSubmit = async (data: shemaType) => {
    try {
      const response = await reqLoginInto(data);
      saveCredentials(response);
      showToast("Uspešno ste se prijavili.", "success");
      navigate("/index", { replace: true });
    } catch {
      showToast("Nepostojeće korisničko ime ili lozinka", "error");
    } finally {
      reset();
    }
  };

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-100 p-4">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <img
              className="mx-auto max-h-14 w-auto object-contain"
              src={assetUrl("logo-IMP.png")}
              alt="IMP logo"
            />
          </div>
          <div className="surface-card overflow-hidden shadow-xl">
            <Form onSubmit={handleSubmit(onSubmit)} enctype={undefined}>
              <div className="grid gap-5 p-6 sm:p-8">
                <div className="mb-1 text-center">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Aplikacija za evidenciju mernih instrumenata i alata
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Prijavite se da biste nastavili
                  </p>
                </div>
                <Input
                  register={register("username")}
                  picturePath={assetUrl("userLogo.png")}
                  placeHolder="Unesite korisničko ime"
                  typeInput="text"
                  autoCompleteTxt="username"
                />
                <Input
                  register={register("password")}
                  picturePath={assetUrl("lock.png")}
                  placeHolder="Unesite lozinku"
                  typeInput="password"
                  autoCompleteTxt="current-password"
                />
                <PrimaryButton
                  isDisable={!isValid}
                  buttonText={"Prijavi se"}
                  buttonColor="blue"
                />
              </div>
              <></>
            </Form>
          </div>
          <p className="mt-6 text-center text-xs text-slate-400">
            EVmer sistem za upravljanje opremom
          </p>
        </div>
      </main>
    </>
  );
};
