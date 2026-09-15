import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import type { PageableProps } from "../scripts/Types";
import { useEffect, useState } from "react";
import { Table } from "../components/Tables/Table";
import { NoDataError } from "../components/Errors/NoDataError";
import { CalibrationStatusBadge } from "../components/Badges/StatusBadge";
import {
  ChangePageCalibrations,
  getCalibrations,
  reqFilterCalibrations,
  type FilterCalibration,
} from "../api/calibrations/calibrations";
import type { CalibrationResponse } from "../api/equipments/equipments";
import { CalibrationFilter } from "../components/Filters/CalibrationFilter";
import { useToastStore } from "../api/ToastStore";
import { type FilterHistoryProps } from "../api/histories/histories";
import { useGlobalData } from "../api/GlobalData";

export const CalibrationsV = () => {
  const [data, setData] = useState<CalibrationResponse | null>(null);
  const [needFilter, setNeedFilter] = useState<FilterHistoryProps | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  const loadData = async () => {
    const response = await getCalibrations();
    setData(response);
  };

  useEffect(() => {
    loadData();
  }, []);

  const calibrationStatuses: string[] = useGlobalData(
    (state) => state.calibrationStatuses,
  );

  const ChangePage = async (obj: PageableProps) => {
    try {
      const pageData = await ChangePageCalibrations(obj);
      setData(pageData);
    } catch (error) {
      console.log(error);
    }
  };

  const FilterItems = async (data: FilterCalibration) => {
    const newA = { ...needFilter, ...data };
    setNeedFilter(newA);
    const res = await reqFilterCalibrations(data);
    setData(res);
    if (res.calibrations.length > 0)
      showToast("Uspešno izvršeno filtriranje!", "success");
    else showToast("Nema traženih podataka", "error");
  };

  return (
    <>
      <div className="app-shell">
        <Header />
        <div className="app-layout">
          <AsideBar />
          <main className="app-main">
            <h1 className="page-title">Kalibracije</h1>
            <div className="flex flex-col">
              <CalibrationFilter
                FilterItems={FilterItems}
                ResetItems={loadData}
                statuses={calibrationStatuses}
              />
            </div>
            <div className="page-content space-y-6">
              {data?.calibrations ? (
                <Table
                  data={data.calibrations}
                  labels={{
                    name: "Naziv Opreme",
                    lastCalibration: "Poslednja kalibracija",
                    nextCalibration: "Sledeća kalibracija",
                    calibrationResult: "Rezultat kalibracije",
                    calibrationStatus: "Status kalibracije",
                    calibrationNote: "Napomena kalibracije",
                  }}
                  cellRenderers={{
                    calibrationStatus: (status) => (
                      <CalibrationStatusBadge status={status} />
                    ),
                  }}
                  tableType="fault"
                  totalPageNumber={data.numPageCalibrations}
                  changePageFunction={ChangePage}
                />
              ) : (
                <NoDataError message="Nema podataka o istoriji..." />
              )}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};
