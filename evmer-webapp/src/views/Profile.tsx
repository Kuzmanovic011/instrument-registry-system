import { useEffect, useState } from "react";
import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { getProfile, editProfile, changePassword, type User, type EditProfile, type ChangePasswordRequest } from "../api/users/users";
import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { ChangePasswordDialog } from "../components/Dialogs/ChangePasswordDialog";
import { EditProfileDialog } from "../components/Dialogs/EditProfileDialog";
import { useToastStore } from "../api/ToastStore";

export const ProfileV = () => {
  const [profile, setProfile] = useState<User | null>(null);

  const [activeDialog, setActiveDialog] = useState<
    "editProfile" | "changePassword" | null
  >(null);

  const showToast = useToastStore((state) => state.showToast);

  const loadProfile = async () => {
    const response = await getProfile();
    setProfile(response);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const Edit = async (data: EditProfile) => {
    await editProfile(data);
    await loadProfile();
    setActiveDialog(null);
    showToast("Izmena je izvršena.", "success");
  };

  const ChangePassword = async (data: ChangePasswordRequest) => {
    await changePassword(data);
    setActiveDialog(null);
    showToast("Lozinka je promenjena.", "success");
  };

  return (
    <>
      {activeDialog === "changePassword" && (
        <ChangePasswordDialog
          cancelClick={() => setActiveDialog(null)}
          changePassword={ChangePassword}
        />
      )}

      {activeDialog === "editProfile" && profile && (
        <EditProfileDialog
          cancelClick={() => setActiveDialog(null)}
          profileData={profile}
          editData={Edit}
        />
      )}

      <div className="app-shell">
        <Header />

        <div className="app-layout">
          <AsideBar />

          <main className="app-main">
            <h1 className="page-title">Moj korisnički nalog</h1>

            {profile && (
              <div className="surface-card page-content max-w-3xl overflow-hidden">
                <dl className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0">
                  {[
                    ["Ime", profile.firstName],
                    ["Prezime", profile.lastName],
                    ["Korisničko ime", profile.username],
                    ["Email", profile.email],
                    ["Odeljenje", profile.department],
                    ["Uloga", profile.role],
                  ].map(([label, value]) => (
                    <div
                      className="border-b border-slate-100 px-5 py-4"
                      key={label}
                    >
                      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {label}
                      </dt>

                      <dd className="mt-1 text-sm font-medium text-slate-800">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap justify-end gap-3 bg-slate-50 px-5 py-4">
                  <PrimaryButton
                    buttonText="Izmeni profil"
                    onClick={() => setActiveDialog("editProfile")}
                  />

                  <PrimaryButton
                    buttonText="Promeni lozinku"
                    onClick={() => setActiveDialog("changePassword")}
                  />
                </div>
              </div>
            )}
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};
