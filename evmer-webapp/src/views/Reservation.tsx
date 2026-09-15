import { useEffect, useState } from "react";
import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { useContextMenu } from "../components/Hooks/useContextMenu";
import { ContextMenu } from "../components/ContextMenus/ContextMenu";
import { Table, type TableRowType } from "../components/Tables/Table";
import { NoDataError } from "../components/Errors/NoDataError";
import { DeleteReservationDialog } from "../components/Dialogs/DeleteReservationDialog";
import {} from "../api/users/users";
import { useToastStore } from "../api/ToastStore";
import { ReservationStatusBadge } from "../components/Badges/StatusBadge";
import type { PageableProps } from "../scripts/Types";
import {
  ChangePageReservation,
  deleteReservation,
  getReservation,
  reqFilterReservation,
  type DeleteReservationRequest,
  type FilterReservation,
  type Reservation,
  type ReservationResponse,
} from "../api/reservations/reservations";
import type { ActiveDialog } from "../components/Dialogs/GenericDialogModal";
import { ReservationFilter } from "../components/Filters/ReservationFilter";

export const ReservationV = () => {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [reservation, setReservation] = useState<ReservationResponse>();
  const [needFilter, setNeedFilter] = useState<FilterReservation | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  const {
    xPos,
    yPos,
    showMenu,
    menuRef,
    selectedRow,
    handleContextMenu,
    closeContextMenu,
  } = useContextMenu<TableRowType>();

  useEffect(() => {
    if (activeDialog) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDialog]);

  const loadData = async () => {
    const response = await getReservation();
    setReservation(response);
  };

  useEffect(() => {
    loadData();
  }, []);

  const ChangePage = async (obj: PageableProps) => {
    const newObj = {
      ...obj,
      ...needFilter,
    };

    const pageData = await ChangePageReservation(newObj);
    setReservation(pageData);
  };

  const DeleteReservation = async (
    id: number,
    data: DeleteReservationRequest,
  ) => {
    await deleteReservation(id, data);
    await loadData();
    setActiveDialog(null);
    showToast("Rezervacija je obrisana.", "success");
  };

  const FilterItems = async (data: FilterReservation) => {
    const newA = {
      ...needFilter,
      ...data,
    };
    setNeedFilter(newA);
    const res = await reqFilterReservation(newA);
    setReservation(res);
    if (res.reservations.length > 0)
      showToast("Uspešno izvršeno filtriranje!", "success");
    else showToast("Nema traženih podataka", "error");
  };

  return (
    <>
      <ContextMenu
        tableType="reservation"
        selectedRow={selectedRow?.row}
        showMenu={showMenu}
        xPos={xPos}
        yPos={yPos}
        menuRef={menuRef}
        onAction={closeContextMenu}
        deleteReservation={() => setActiveDialog("deleteReservation")}
      />

      {activeDialog === "deleteReservation" &&
        selectedRow?.tableType === "reservation" && (
          <DeleteReservationDialog
            idEquipment={(selectedRow?.row as Reservation).idReservation}
            cancelClick={() => setActiveDialog(null)}
            modalTitle="Dodaj rezervaciju"
            showMenu={activeDialog === "deleteReservation"}
            deleteReservation={DeleteReservation}
          />
        )}

      <div className="app-shell">
        <Header />

        <div className="app-layout">
          <AsideBar />

          <main className="app-main">
            <h1 className="page-title">Rezervacije</h1>

            <div className="page-content space-y-6">
              <ReservationFilter
                FilterItems={FilterItems}
                ResetItems={loadData}
              />
              {reservation ? (
                <Table
                  data={reservation.reservations}
                  labels={{
                    idReservation: "ID rezervacije",
                    equipmentName: "Naziv opreme",
                    userFirstName: "Ime korisnika",
                    userLastName: "Prezime korisnika",
                    reservedAt: "Rezervisano",
                    status: "Status",
                    note: "Napomena rezervacije",
                  }}
                  cellRenderers={{
                    status: (status) => (
                      <ReservationStatusBadge status={status} />
                    ),
                  }}
                  tableType="reservation"
                  onRowContextMenu={handleContextMenu}
                  totalPageNumber={reservation.numPageReservations}
                  changePageFunction={ChangePage}
                />
              ) : (
                <NoDataError message="Nema podataka o rezervacijama..." />
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};
