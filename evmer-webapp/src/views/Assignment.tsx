import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { useEffect, useState } from "react";
import { useGlobalData } from "../api/GlobalData";
import { type PageableProps } from "../scripts/Types";
import { Table } from "../components/Tables/Table";
import {
  ChangePageAssignment,
  type FilterHistoryAssignments,
  type AssignmentResponse,
  type FilterActiveAssignments,
} from "../api/assignments/assignments";
import { useToastStore } from "../api/ToastStore";
import { ActiveAssignmentFilter } from "../components/Filters/ActiveAssignmentFilter";
import { HistoryAssignmentFilter } from "../components/Filters/HistoryAssignmentFilter";

export const AssignmentV = () => {
  const [assignments, setAssignments] = useState<AssignmentResponse>();
  const [historyAssignments, setHistoryAssignments] = useState<boolean>(false);
  const expectedTableSorts = useGlobalData((state) => state.expectedTableSorts);

  const assignmentTable = expectedTableSorts?.find(
    (sort) => sort === "ASSIGNMENTS",
  );
  const historyTable = expectedTableSorts?.find((sort) => sort === "HISTORY");
  const [needFilter, setNeedFilter] = useState<FilterActiveAssignments | null>(
    null,
  );
  const [needHistoryFilter, setNeedHistoryFilter] =
    useState<FilterHistoryAssignments | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    if (!assignmentTable) return;
    const loadData = async () => {
      try {
        const response = await ChangePageAssignment({
          table: assignmentTable,
          page: 0,
          sortBy: "id",
          ascending: true,
          size: 5,
          request: null,
        });

        setAssignments(response);
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, [assignmentTable]);

  const ChangePage = async (obj: PageableProps) => {
    try {
      const pageData = await ChangePageAssignment({
        ...obj,
        ...(historyAssignments ? needHistoryFilter : needFilter),
        table: historyAssignments ? historyTable : assignmentTable,
      });

      setAssignments(pageData);
    } catch (error) {
      console.log(error);
    }
  };

  const changeAssignmentTable = async (isHistory: boolean) => {
    const table = isHistory ? historyTable : assignmentTable;
    if (!table) return;
    try {
      const response = await ChangePageAssignment({
        table,
        page: 0,
        sortBy: "id",
        ascending: true,
        size: 5,
        request: null,
      });
      setAssignments(response);
      setHistoryAssignments(isHistory);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    try {
      const response = await ChangePageAssignment({
        table: historyAssignments ? historyTable : assignmentTable,
        page: 0,
        size: 5,
        sortBy: "id",
        ascending: true,
        request: null,
      });

      setAssignments(response);

      if (historyAssignments) {
        setNeedHistoryFilter(null);
      } else {
        setNeedFilter(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FilterItems = async (data: FilterActiveAssignments) => {
    const newFilter = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== ""),
    ) as FilterActiveAssignments;

    setNeedFilter(newFilter);

    try {
      const res = await ChangePageAssignment({
        page: 0,
        size: 5,
        sortBy: "id",
        ascending: true,
        table: assignmentTable,
        request: null,
        ...newFilter,
      });

      console.log("FILTER RESPONSE:", res);

      setAssignments(res);

      if (res.activeAssignments.length > 0) {
        showToast("Uspešno izvršeno filtriranje!", "success");
      } else {
        showToast("Nema traženih podataka", "error");
      }
    } catch (error) {
      console.log("FILTER ERROR:", error);
    }
  };

  const FilterHistoryItems = async (data: FilterHistoryAssignments) => {
    const newFilter = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== ""),
    ) as FilterHistoryAssignments;

    console.log("NEW HISTORY FILTER:", newFilter);

    setNeedHistoryFilter(newFilter);

    try {
      const res = await ChangePageAssignment({
        page: 0,
        size: 5,
        sortBy: "id",
        ascending: true,
        table: historyTable,
        request: null,
        ...newFilter,
      });


      setAssignments(res);

      if (res.historyAssignments.length > 0) {
        showToast("Uspešno izvršeno filtriranje!", "success");
      } else {
        showToast("Nema traženih podataka", "error");
      }
    } catch (error) {
      console.log("HISTORY FILTER ERROR:", error);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="app-layout">
        <AsideBar />
        <main className="app-main">
          <h1 className="page-title">Zaduženja</h1>
          <div className="mb-8 flex justify-end gap-2 border-b border-slate-200">
            <button
              onClick={() => changeAssignmentTable(false)}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
                !historyAssignments
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Aktivna zaduženja
            </button>

            <button
              onClick={() => changeAssignmentTable(true)}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
                historyAssignments
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Istorija zaduženja
            </button>
          </div>
          <div className="space-y-6">
            {assignments && historyAssignments ? (
              <div>
                <HistoryAssignmentFilter
                  FilterItems={FilterHistoryItems}
                  ResetItems={loadData}
                />
                <Table
                  data={assignments.historyAssignments ?? []}
                  labels={{
                    id: "ID zaduženja",
                    userUsername: "Korisničko ime",
                    userFirstName: "Ime",
                    userLastName: "Prezime",
                    equipmentName: "Naziv opreme",
                    accessories: "Dodatna oprema",
                    eventType: "Tip događaja",
                    oldValue: "Stara vrednost",
                    newValue: "Nova vrednost",
                    performedAt: "Odradjeno",
                    note: "Napomena",
                  }}
                  tableType="assignment"
                  tableSort={historyTable}
                  changePageFunction={ChangePage}
                  totalPageNumber={assignments.numPageHistoryAssignment}
                />
              </div>
            ) : !historyAssignments && assignments ? (
              <div>
                <ActiveAssignmentFilter
                  FilterItems={FilterItems}
                  ResetItems={loadData}
                />
                <Table
                  data={assignments?.activeAssignments ?? []}
                  labels={{
                    id: "ID Zaduženja",
                    userUsername: "Korisničko ime",
                    userFirstName: "Ime",
                    userLastName: "Prezime",
                    equipmentName: "Naziv opreme",
                    projectOrTask: "Projekat ili zadatak",
                    assignedAt: "Zaduzeno",
                    accessories: "Dodatna oprema",
                    assignmentNote: "Napomena",
                  }}
                  tableType="assignment"
                  tableSort={assignmentTable}
                  changePageFunction={ChangePage}
                  totalPageNumber={assignments?.numPageActiveAssignment ?? 0}
                />
              </div>
            ) : null}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
