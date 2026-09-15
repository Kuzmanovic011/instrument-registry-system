import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { useEffect, useState } from "react";
import { type PageableProps } from "../scripts/Types";
import { Table } from "../components/Tables/Table";
import { NoDataError } from "../components/Errors/NoDataError";
import { FaultStatusBadge } from "../components/Badges/StatusBadge";
import {
  ChangePageFault,
  getFault,
  type FaultResponse,
  type FilterFaultProps,
} from "../api/faultReports/faultReports";
import { FaultFilter } from "../components/Filters/FaultFilter";
import { useToastStore } from "../api/ToastStore";
import { reqFilterFaults } from "../api/faultReports/faultReports";

export const FaultsV = () => {
  const [fault, setFault] = useState<FaultResponse>();
  const [needFilter, setNeedFilter] = useState<FilterFaultProps | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const loadData = async () => {
      const response = await getFault();
      setFault(response);
    };
    loadData();
  }, []);

  const ChangePage = async (obj: PageableProps) => {
    const newObj = {
      ...obj,
      ...needFilter,
    };
    const pageData = await ChangePageFault(newObj);
    setFault(pageData);
  };

  const loadData = async () => {
    const response = await getFault();
    setFault(response);
  };

  const FilterItems = async (data: FilterFaultProps) => {
    const newA = { ...needFilter, ...data };
    setNeedFilter(newA);
    const res = await reqFilterFaults(data);
    setFault(res);
    if (res.reports.length > 0)
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
            <h1 className="page-title">Kvarovi</h1>
            <FaultFilter FilterItems={FilterItems} ResetItems={loadData} />
            <div className="page-content space-y-6">
              {fault && fault.reports.length > 0 ? (
                <Table
                  data={fault.reports}
                  labels={{
                    equipmentName: "Naziv Opreme",
                    userFirstName: "Ime korisnika",
                    userLastName: "Prezime korisnika",
                    reportedAt: "Prijavljeno",
                    desc: "Opis",
                    severity: "Ozbiljnost",
                    status: "Status",
                    resolvedAt: "Rešeno",
                    resolutionNote: "Napomena rešenja",
                  }}
                  cellRenderers={{
                    status: (status) => <FaultStatusBadge active={status} />,
                  }}
                  tableType="fault"
                  //onRowContextMenu={handleContextMenu}
                  totalPageNumber={fault.reportsPage}
                  changePageFunction={ChangePage}
                />
              ) : (
                <NoDataError message="Nema podataka o opremi..." />
              )}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};
