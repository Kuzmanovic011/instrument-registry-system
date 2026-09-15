import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { useEffect, useState } from "react";
import { Table } from "../components/Tables/Table";
import { NoDataError } from "../components/Errors/NoDataError";
import {
  ChangePageHistory,
  getHistory,
  reqFilterHistories,
  type FilterHistoryProps,
  type HistoryResponse,
} from "../api/histories/histories";
import type { PageableProps } from "../scripts/Types";
import { HistoryFilter } from "../components/Filters/HistoryFilter";
import { useGlobalData } from "../api/GlobalData";
import { useToastStore } from "../api/ToastStore";

export const HistoryV = () => {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [needFilter, setNeedFilter] = useState<FilterHistoryProps | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  const historyEvents = useGlobalData((state) => state.historyEvents);

  const loadData = async () => {
    const response = await getHistory();
    setData(response);
  };

  useEffect(() => {
    loadData();
  }, []);

  const ChangePage = async (obj: PageableProps) => {
    const newObj = {
      ...obj,
      ...needFilter,
    };

    const pageData = await ChangePageHistory(newObj);

    setData(pageData);
  };

  const FilterItems = async (data: FilterHistoryProps) => {
    const newA = { ...needFilter, ...data };
    setNeedFilter(newA);
    const res = await reqFilterHistories(data);
    setData(res);
    if (res.equipmentHistory.length > 0)
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
            <h1 className="page-title">Istorija</h1>
            <div className="flex flex-col">
              <HistoryFilter
                FilterItems={FilterItems}
                ResetItems={loadData}
                type={historyEvents}
              />
            </div>
            <div className="page-content space-y-6">
              {data?.equipmentHistory ? (
                <Table
                  data={data.equipmentHistory}
                  labels={{
                    equipmentName: "Naziv Opreme",
                    userFirstName: "Ime korisnika",
                    userLastName: "Prezime korisnika",
                    eventType: "Tip događaja",
                    oldValue: "Stara vrednost",
                    newValue: "Nova vrednost",
                    performedAt: "Datum",
                    note: "Napomena",
                  }}
                  tableType="history"
                  totalPageNumber={data.numPagesHistory}
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
