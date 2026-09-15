import { Card } from "../components/Cards/Card";
import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { useEffect, useState } from "react";
import { type PageableProps } from "../scripts/Types";
import { Table } from "../components/Tables/Table";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { NoDataError } from "../components/Errors/NoDataError";
import { useGlobalData } from "../api/GlobalData";
import {
  CalibrationStatusBadge,
  ReservationStatusBadge,
} from "../components/Badges/StatusBadge";
import {
  ChangePageIndex,
  getIndexData,
  type IndexType,
} from "../api/indexes/indexes";

export const IndexV = () => {
  const [data, setData] = useState<IndexType | null>(null);
  const expectedTableSorts = useGlobalData((state) => state.expectedTableSorts);

  const assignmentTable = expectedTableSorts?.find(
    (sort) => sort === "ASSIGNMENTS",
  );
  const reservationTable = expectedTableSorts?.find(
    (sort) => sort === "RESERVATIONS",
  );
  const calibrationTable = expectedTableSorts?.find(
    (sort) => sort === "CALIBRATIONS",
  );

  const historyTable = expectedTableSorts?.find(
    (sort) => sort === "ACTIVITIES",
  );

  const loadData = async () => {
    const response = await getIndexData();
    setData(response);
  };

  useEffect(() => {
    loadData();
  }, []);

  const ChangePage = async (obj: PageableProps) => {
    const pageData = await ChangePageIndex(obj);

    setData(pageData);
  };

  return (
    <>
      <div className="app-shell">
        <Header />
        <div className="app-layout">
          <AsideBar />
          <main className="app-main">
            <div className="mb-6">
              <h1 className="page-title">Pregled sistema</h1>
              <p className="mt-1 text-sm text-slate-500">
                Aktuelno stanje opreme, zaduženja, rezervacija i kalibracija.
              </p>
            </div>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card
                title="Ukupan broj opreme"
                value={data ? data.numTotalEquipment : 0}
              />
              <Card
                title="Broj slobodnih stavki"
                value={data ? data.numAvailableEquipment : 0}
              />
              <Card
                title="Broj neispravnih stavki"
                value={data ? data.numBrokenEquipment : 0}
              />
              <Card
                title="Broj zauzetih stavki"
                value={data ? data.numAssignedEquipment : 0}
              />
            </div>

            <div>
              {data?.assignments ? (
                <Table
                  data={data.assignments}
                  labels={{
                    equipmentName: "Naziv Opreme",
                    assignedAt: "Datum zaduženja",
                    projectOrTask: "Projekat ili zadatak",
                    assignmentNote: "Napomena",
                  }}
                  tableType="assignment"
                  tableSort={assignmentTable}
                  tableTitle="Tabela Zaduženja"
                  totalPageNumber={data.numAssignedEquipmentPage}
                  changePageFunction={ChangePage}
                />
              ) : (
                <NoDataError message="Nema podataka o zaduženjima..." />
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div>
                {data?.reservations ? (
                  <Table
                    data={data.reservations}
                    labels={{
                      equipmentName: "Naziv Opreme",
                      userFirstName: "Ime korisnika",
                      userLastName: "Prezime Korisnika",
                      reservedAt: "datum i vreme rezervacije",
                      note: "napomena",
                    }}
                    cellRenderers={{
                      status: (status) => (
                        <ReservationStatusBadge status={status} />
                      ),
                    }}
                    tableType="reservation"
                    tableSort={reservationTable}
                    tableTitle="Tabela Rezervacije"
                    totalPageNumber={data.numActiveReservationsPage}
                    changePageFunction={ChangePage}
                  />
                ) : (
                  <NoDataError message="Nema podataka o rezervacijama..." />
                )}
              </div>
              <div>
                {data?.calibrations ? (
                  <Table
                    data={data.calibrations}
                    labels={{
                      name: "Naziv Opreme",
                      lastCalibration: "Poslednja kalibracija",
                      nextCalibration: "Sledeća kalibracija",
                      calibrationNote: "Napomena",
                      calibrationStatus: "Status kalibracije",
                    }}
                    cellRenderers={{
                      calibrationStatus: (status) => (
                        <CalibrationStatusBadge status={status} />
                      ),
                    }}
                    tableType="calibration"
                    tableSort={calibrationTable}
                    tableTitle="Tabela Kalibracije"
                    totalPageNumber={data.numCalibrationDuePage}
                    changePageFunction={ChangePage}
                  />
                ) : (
                  <NoDataError message="Nema podataka o kalibracijama..." />
                )}
              </div>
              <div>
                {data?.activities ? (
                  <Table
                    data={data.activities}
                    labels={{
                      equipmentName: "Naziv Opreme",
                      eventType: "Tip događaja",
                      oldValue: "Stara vrednost",
                      newValue: "Nova vrednost",
                      performedAt: "Obavljeno",
                      note: "Napomena",
                    }}
                    tableType="ACTIVITIES"
                    tableSort={historyTable}
                    tableTitle="Tabela aktivnosti"
                    totalPageNumber={data.numHistoryPage}
                    changePageFunction={ChangePage}
                  />
                ) : (
                  <NoDataError message="Nema podataka o događajima..." />
                )}
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};
