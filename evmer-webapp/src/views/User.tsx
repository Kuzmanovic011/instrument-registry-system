import { useEffect, useState } from "react";
import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { NoDataError } from "../components/Errors/NoDataError";
import { Table } from "../components/Tables/Table";
import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { ContextMenu } from "../components/ContextMenus/ContextMenu";
import { useContextMenu } from "../components/Hooks/useContextMenu";
import { AddUserDialog } from "../components/Dialogs/AddUserDialog";
import { EditUserDialog } from "../components/Dialogs/EditUserDialog";
import { DeleteUserDialog } from "../components/Dialogs/DeleteUserDialog";
import { ChangePasswordAdminDialog } from "../components/Dialogs/ChangePasswordAdminDIalog";
import { UserFilter } from "../components/Filters/UserFilter";
import type { FilterUserProps } from "../api/users/users";
import {
  getUserResponse,
  ChangePageUser,
  addUser,
  editUser,
  deleteUser,
  restoreUser,
  makeAdministrator,
  changePasswordAdmin,
  type UserResponse,
  type User,
  type ChangePasswordAdminRequest,
  type UserEdit,
  type UserRequest,
} from "../api/users/users";
import { useGlobalData } from "../api/GlobalData";
import { useToastStore } from "../api/ToastStore";
import { getRole } from "../scripts/Session";

import type { PageableProps } from "../scripts/Types";
import type { ActiveDialog } from "../components/Dialogs/GenericDialogModal";
import { reqFilterUsers } from "../api/users/users";

export const UserV = () => {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [needFilter, setNeedFilter] = useState<FilterUserProps | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  const userRolesUpdate = useGlobalData((state) => state.userRolesUpdate);

  const userRoles = useGlobalData((state) => state.userRoles);

  const {
    xPos,
    yPos,
    showMenu,
    selectedRow,
    menuRef,
    handleContextMenu,
    closeContextMenu,
  } = useContextMenu<User>();

  useEffect(() => {
    if (activeDialog) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDialog]);

  const loadData = async () => {
    try {
      const response = await getUserResponse();
      setUser(response);
    } catch {
      showToast("Greška prilikom učitavanja korisnika.", "error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const ChangePasswordAdmin = async (
    id: number,
    data: ChangePasswordAdminRequest,
  ) => {
    try {
      await changePasswordAdmin(id, data);
      await loadData();

      setActiveDialog(null);
      showToast("Lozinka korisnika je promenjena.", "success");
    } catch {
      showToast("Greška prilikom promene lozinke korisnika.", "error");
    }
  };

  const MakeAdministrator = async (id: number) => {
    try {
      await makeAdministrator(id);
      await loadData();

      showToast("Korisnik je postavljen za administratora.", "success");
    } catch {
      showToast(
        "Greška prilikom postavljanja korisnika za administratora.",
        "error",
      );
    }
  };

  const Delete = async (id: number) => {
    try {
      await deleteUser(id);
      await loadData();

      setActiveDialog(null);
      showToast("Korisnik je obrisan.", "success");
    } catch {
      showToast("Greška prilikom brisanja korisnika.", "error");
    }
  };

  const Restore = async (id: number) => {
    try {
      await restoreUser(id);
      await loadData();
      showToast("Korisnik je vraćen.", "success");
    } catch {
      showToast("Greška prilikom vraćanja korisnika.", "error");
    }
  };
  const Edit = async (id: number, data: UserEdit) => {
    try {
      await editUser(id, data);
      await loadData();
      setActiveDialog(null);
      showToast("Izmena je izvršena.", "success");
    } catch {
      showToast("Greška prilikom izmene korisnika.", "error");
    }
  };

  const ChangePage = async (obj: PageableProps) => {
    const newObj = {
      ...obj,
      ...needFilter,
    };

    const pageData = await ChangePageUser(newObj);

    setUser(pageData);
  };

  const Add = async (data: UserRequest) => {
    try {
      await addUser(data);
      await loadData();

      setActiveDialog(null);
      showToast("Korisnik je dodat.", "success");
    } catch {
      showToast("Greška prilikom dodavanja korisnika.", "error");
    }
  };

  const FilterItems = async (data: FilterUserProps) => {
    const newA = { ...needFilter, ...data };
    setNeedFilter(newA);
    const res = await reqFilterUsers(data);
    setUser(res);
    if (res.users.length > 0)
      showToast("Uspešno izvršeno filtriranje!", "success");
    else showToast("Nema traženih podataka", "error");
  };

  return (
    <>
      <ContextMenu
        selectedRow={selectedRow ? selectedRow.row : undefined}
        tableType="user"
        showMenu={showMenu}
        xPos={xPos}
        yPos={yPos}
        menuRef={menuRef}
        onAction={closeContextMenu}
        editUser={() => setActiveDialog("editUser")}
        deleteDialog={() => setActiveDialog("delete")}
        restoreFunction={Restore}
        makeAdministrator={MakeAdministrator}
        changeUserPassword={() => setActiveDialog("changePasswordAdmin")}
      />

      {activeDialog === "editUser" && selectedRow?.tableType === "user" && (
        <EditUserDialog
          cancelClick={() => setActiveDialog(null)}
          rowData={selectedRow.row}
          editData={Edit}
          userRoles={userRolesUpdate}
        />
      )}

      {activeDialog === "delete" && selectedRow && (
        <DeleteUserDialog
          close={() => setActiveDialog(null)}
          deleteUserId={selectedRow.row.id}
          deleteFunction={Delete}
        />
      )}

      {activeDialog === "changePasswordAdmin" && selectedRow && (
        <ChangePasswordAdminDialog
          cancelClick={() => setActiveDialog(null)}
          changePassword={(data) =>
            ChangePasswordAdmin(selectedRow.row.id, data)
          }
        />
      )}

      <AddUserDialog
        showMenu={activeDialog === "add"}
        cancelClick={() => setActiveDialog(null)}
        addData={Add}
      />

      <div className="app-shell">
        <Header />

        <div className="app-layout">
          <AsideBar />

          <main className="app-main">
            <h1 className="page-title">Korisnici</h1>
            <div className="flex flex-col">
              <UserFilter
                FilterItems={FilterItems}
                ResetItems={loadData}
                roles={userRoles}
              />
            </div>
            <div className="page-content space-y-6">
              {user ? (
                <Table
                  data={user.users}
                  labels={{
                    id: "ID korisnika",
                    firstName: "Ime korisnika",
                    lastName: "Prezime korisnika",
                    username: "Korisničko ime",
                    email: "Email",
                    role: "Uloga",
                    department: "Odeljenje",
                    active: "Aktivan",
                    lastLoginAt: "Poslednji login",
                  }}
                  tableType="user"
                  onRowContextMenu={handleContextMenu}
                  totalPageNumber={user.numPageUsers}
                  changePageFunction={ChangePage}
                />
              ) : (
                <NoDataError message="Nema podataka o korisnicima..." />
              )}

              {getRole() === "ADMINISTRATOR" && (
                <div className="flex justify-end">
                  <PrimaryButton
                    buttonText="Dodaj korisnika"
                    onClick={() => setActiveDialog("add")}
                  />
                </div>
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};
