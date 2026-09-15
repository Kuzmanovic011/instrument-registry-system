import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { useEffect, useState } from "react";
import { Table } from "../components/Tables/Table";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { NoDataError } from "../components/Errors/NoDataError";
import { useContextMenu } from "../components/Hooks/useContextMenu";
import { ContextMenu } from "../components/ContextMenus/ContextMenu";
import { EditEquipmentDialog } from "../components/Dialogs/EditEquipmentDialog";
import { AddCalibrationDialog } from "../components/Dialogs/AddCalibrationDialog";
import { AddEquipmentCategoryDialog } from "../components/Dialogs/AddEquipmentCategoryDialog";
import { AddEquipmentDialog } from "../components/Dialogs/AddEquipmentDialog";
import { DetailsDialog } from "../components/Dialogs/DetailsDialog";
import { DeleteEquipment } from "../components/Dialogs/DeleteEquipment";
import { PrimaryButton } from "../components/Buttons/PrimaryButton";
import { getRole } from "../scripts/Session";
import { NextCalibrationDialog } from "../components/Dialogs/NextCalibrationDialog";
import { useGlobalData } from "../api/GlobalData";
import { AssignEquipmentDialog } from "../components/Dialogs/AssignEquipmentDialog";
import { UnassignEquipmentDialog } from "../components/Dialogs/UnassignEquipmentDialog";
import { ReportFaultDialog } from "../components/Dialogs/reportFaultDialog";
import { AddReservationDialog } from "../components/Dialogs/AddReservationDialog";
import { FaultResolveDialog } from "../components/Dialogs/FaultResolveDialog";
import { EquipmentStatusBadge } from "../components/Badges/StatusBadge";
import { useToastStore } from "../api/ToastStore";
import { EquipmentFilter } from "../components/Filters/EquipmentFilter";
import {
  addCalibrationEquipment,
  addEquipment,
  assignEquipment,
  ChangePageEquipment,
  deleteEquipment,
  editEquipment,
  equipmentFaultReport,
  getEquipment,
  reqAddEquipmentCategory,
  reqFaultResolve,
  reqFilterItems,
  restoreEquipment,
  ScheduleCalibration,
  unassignEquipment,
  type addCalibrationEquipmentProps,
  type AddEquipmentCategoryProps,
  type AssignEquipmentRequest,
  type Equipment,
  type EquipmentType,
  type FilterItemsProps,
  type Unassign,
} from "../api/equipments/equipments";
import type { ActiveDialog } from "../components/Dialogs/GenericDialogModal";
import {
  addReservation,
  type AddReservationRequest,
  type DeleteReservationRequest,
} from "../api/reservations/reservations";
import type { PageableProps } from "../scripts/Types";
import type { EquipmentFaultReport } from "../api/faultReports/faultReports";

export const EquipmentV = () => {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
  const [equipment, setEquipment] = useState<EquipmentType | null>(null);
  const [needFilter, setNeedFilter] = useState<FilterItemsProps | null>(null);
  const showToast = useToastStore((state) => state.showToast);
  const {
    xPos,
    yPos,
    showMenu,
    selectedRow,
    menuRef,
    handleContextMenu,
    closeContextMenu,
  } = useContextMenu<Equipment>();

  useEffect(() => {
    if (activeDialog) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeDialog]);

  const loadData = async () => {
    const response = await getEquipment();
    setEquipment(response);
  };

  useEffect(() => {
    loadData();
  }, []);

  const equipmentCategories = useGlobalData(
    (state) => state.equipmentCategories,
  );
  const equipmentStatuses = useGlobalData((state) => state.equipmentStatuses);
  const calibrationResults = useGlobalData((state) => state.calibrationResults);

  const Edit = async (obj: Partial<Equipment>, file?: File) => {
    await editEquipment(obj, file);
    await loadData();
    setActiveDialog(null);
    showToast("Izmena je izvršena.", "success");
  };

  const Add = async (obj: Partial<Equipment>, file?: File) => {
    await addEquipment(obj, file);
    await loadData();
    setActiveDialog(null);
    showToast("Dodavanje je izvršeno.", "success");
  };

  const AddCalibration = async (
    id: number,
    data: addCalibrationEquipmentProps,
  ) => {
    await addCalibrationEquipment(id, data);
    await loadData();
    setActiveDialog(null);
    showToast("Kalibracija je dodata.", "success");
  };

  const AssignEquipment = async (id: number, data: AssignEquipmentRequest) => {
    await assignEquipment(id, data);
    await loadData();
    setActiveDialog(null);
    showToast("Oprema je uspešno zadužena.", "success");
  };

  const FaultResolve = async (data: DeleteReservationRequest) => {
    setActiveDialog(null);
    if (selectedRow) await reqFaultResolve(selectedRow.row.id, data);
    await loadData();
    showToast("Kvar je rešen.", "success");
  };
  const UnassignEquipment = async (id: number, data: Unassign) => {
    await unassignEquipment(id, data);
    await loadData();
    setActiveDialog(null);
    showToast("Oprema je razdužena.", "success");
  };

  const AddReservation = async (id: number, data: AddReservationRequest) => {
    await addReservation(id, data);
    await loadData();
    setActiveDialog(null);
    showToast("Rezervacija je dodata.", "success");
  };

  const RestoreItem = async (id: number) => {
    await restoreEquipment(id);
    await loadData();
    showToast("Oprema je vraćena.", "success");
  };

  const DeleteItem = async (id: number, note: string | undefined) => {
    await deleteEquipment(id, note);
    await loadData();
    setActiveDialog(null);
    showToast("Oprema je obrisana.", "success");
  };
  const ScheduleNextCalibration = async (
    id: number,
    data: { date: string },
  ) => {
    await ScheduleCalibration(id, data);
    await loadData();
    setActiveDialog(null);
    showToast("Sledeća kalibracija je zakazana.", "success");
  };

  const ChangePage = async (obj: PageableProps) => {
    const newObj = {
      ...obj,
      ...needFilter,
    };

    const pageData = await ChangePageEquipment(newObj);

    setEquipment(pageData);
  };

  const ReportFaultEquipment = async (
    id: number,
    data: EquipmentFaultReport,
  ) => {
    await equipmentFaultReport(id, data);
    await loadData();
    setActiveDialog(null);
    showToast("Kvar je prijavljen.", "success");
  };
  const AddEquipmentCategory = async (data: AddEquipmentCategoryProps) => {
    await reqAddEquipmentCategory(data);
    await loadData();
    setActiveDialog(null);
    showToast("Kategorija je dodata.", "success");
  };

  const FilterItems = async (data: FilterItemsProps) => {
    const newA = { ...needFilter, ...data };
    setNeedFilter(newA);
    const res = await reqFilterItems(data);
    setEquipment(res);
    if (res.equipment.length > 0)
      showToast("Uspešno izvršeno filtriranje!", "success");
    else showToast("Nema traženih podataka", "error");
  };

  return (
    <>
      <ContextMenu
        showMenu={showMenu}
        tableType="equipment"
        xPos={xPos}
        yPos={yPos}
        menuRef={menuRef}
        onAction={closeContextMenu}
        showEdit={() => setActiveDialog("edit")}
        showDetails={() => setActiveDialog("details")}
        deleteDialog={() => setActiveDialog("delete")}
        showAddCalibration={() => setActiveDialog("addCalibration")}
        selectedRow={selectedRow ? selectedRow.row : undefined}
        restoreFunction={RestoreItem}
        showNextCalibration={() => setActiveDialog("nextCalibration")}
        assignEquipment={() => setActiveDialog("assign")}
        unassignEquipment={() => setActiveDialog("unassign")}
        reportFault={() => setActiveDialog("fault-report")}
        addReservation={() => setActiveDialog("addReservation")}
        faultResolve={() => setActiveDialog("faultResolve")}
      />
      {activeDialog === "edit" && selectedRow?.tableType === "equipment" && (
        <EditEquipmentDialog
          cancelClick={() => setActiveDialog(null)}
          modalTitle="Izmena opreme"
          rowData={selectedRow?.row}
          editData={Edit}
          statuses={equipmentStatuses}
        />
      )}

      {activeDialog === "nextCalibration" && (
        <NextCalibrationDialog
          cancelClick={() => setActiveDialog(null)}
          showMenu={activeDialog === "nextCalibration"}
          idEquipment={selectedRow ? selectedRow.row.id : undefined}
          ScheduleNextCalibration={ScheduleNextCalibration}
        />
      )}
      {activeDialog === "addCalibration" && (
        <AddCalibrationDialog
          calibrationResults={calibrationResults}
          cancelClick={() => setActiveDialog(null)}
          showMenu={activeDialog === "addCalibration"}
          idEquipment={selectedRow ? selectedRow.row.id : 0}
          addCalibration={AddCalibration}
        />
      )}
      <AddEquipmentDialog
        showMenu={activeDialog === "add"}
        cancelClick={() => setActiveDialog(null)}
        modalTitle="DODAJ OPREMU"
        addData={Add}
        categories={equipmentCategories}
        calibrationResults={calibrationResults}
      />

      <AddEquipmentCategoryDialog
        showMenu={activeDialog == "addEquipmentCategory"}
        cancelClick={() => setActiveDialog(null)}
        AddEquipmentCategory={AddEquipmentCategory}
      />

      {activeDialog === "details" && (
        <DetailsDialog
          data={selectedRow?.row}
          cancelClick={() => setActiveDialog(null)}
        />
      )}

      {activeDialog === "faultResolve" && (
        <FaultResolveDialog
          cancelClick={() => setActiveDialog(null)}
          showMenu={activeDialog == "faultResolve"}
          faultResolveFunction={FaultResolve}
        />
      )}

      {activeDialog === "delete" && (
        <DeleteEquipment
          close={() => setActiveDialog(null)}
          deleteItemId={selectedRow?.row.id}
          deleteFunction={DeleteItem}
        />
      )}
      {activeDialog === "assign" && (
        <AssignEquipmentDialog
          idAssignment={selectedRow ? selectedRow.row.id : undefined}
          cancelClick={() => setActiveDialog(null)}
          modalTitle="Zaduženje opreme"
          showMenu={activeDialog === "assign"}
          assignData={AssignEquipment}
        />
      )}
      {activeDialog === "unassign" && (
        <UnassignEquipmentDialog
          idUnassignment={selectedRow ? selectedRow.row.id : undefined}
          cancelClick={() => setActiveDialog(null)}
          modalTitle="Razduženje opreme"
          showMenu={activeDialog === "unassign"}
          unassignData={UnassignEquipment}
        />
      )}
      {activeDialog === "fault-report" && (
        <ReportFaultDialog
          idFaultReport={selectedRow ? selectedRow.row.id : undefined}
          cancelClick={() => setActiveDialog(null)}
          modalTitle="Prijavi kvar"
          showMenu={activeDialog === "fault-report"}
          reportFault={ReportFaultEquipment}
        />
      )}
      {activeDialog === "addReservation" && (
        <AddReservationDialog
          idEquipment={selectedRow ? selectedRow.row.id : undefined}
          cancelClick={() => setActiveDialog(null)}
          modalTitle="Dodaj rezervaciju"
          showMenu={activeDialog === "addReservation"}
          addReservation={AddReservation}
        />
      )}

      <div className="app-shell">
        <Header />
        <div className="app-layout">
          <AsideBar />
          <main className="app-main">
            <h1 className="page-title">Oprema</h1>
            <div className="page-content space-y-6">
              <div className="flex flex-col">
                <EquipmentFilter
                  FilterItems={FilterItems}
                  ResetItems={loadData}
                  categories={equipmentCategories}
                />
              </div>
              {equipment ? (
                <Table
                  data={equipment.equipment}
                  labels={{
                    name: "Naziv Opreme",
                    inventoryNumber: "Inventarski broj",
                    serialNumber: "Serijski broj",
                    manufacturer: "Proizvođač",
                    manufacturerModel: "Model",
                    categoryName: "Kategorija",
                    status: "Status",
                    homeLocationDescription: "Lokacija",
                    notes: "Napomena",
                    desc: "Opis",
                  }}
                  cellRenderers={{
                    status: (status) => (
                      <EquipmentStatusBadge status={status} />
                    ),
                  }}
                  tableType="equipment"
                  onRowContextMenu={handleContextMenu}
                  totalPageNumber={equipment.equipmentNumPage}
                  changePageFunction={ChangePage}
                />
              ) : (
                <NoDataError message="Nema podataka o opremi..." />
              )}
              {getRole() === "ADMINISTRATOR" && (
                <div className="flex flex-wrap justify-end gap-3">
                  <PrimaryButton
                    buttonText="dodavanje opreme"
                    onClick={() => setActiveDialog("add")}
                  />
                  <PrimaryButton
                    buttonText="dodavanje kategorije"
                    onClick={() => setActiveDialog("addEquipmentCategory")}
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
