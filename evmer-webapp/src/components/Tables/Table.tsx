import { useState, type MouseEvent, type ReactNode } from "react";
import { FaLongArrowAltDown } from "react-icons/fa";
import { type PageableProps } from "../../scripts/Types";
import { PaginationButtons } from "../Pagination/PaginationButtons";
import type { Reservation } from "../../api/reservations/reservations";
import type { Calibration, Equipment } from "../../api/equipments/equipments";
import type {
  ActiveAssignmentResponse,
  Assignment,
  HistoryAssignmentResponse,
} from "../../api/assignments/assignments";
import type { History } from "../../api/histories/histories";
import type { User } from "../../api/users/users";
import type { Fault } from "../../api/faultReports/faultReports";
import type { Activities } from "../../api/indexes/indexes";
export type TableRowType =
  | Reservation
  | Calibration
  | Assignment
  | Equipment
  | ActiveAssignmentResponse
  | HistoryAssignmentResponse
  | User
  | Fault
  | History
  | Activities;

export interface selectedRowType<T> {
  row: T;
  tableType:
    | "reservation"
    | "calibration"
    | "assignment"
    | "equipment"
    | "user"
    | "fault"
    | "history"
    | "ACTIVITIES";
}

interface TableColumn<T> {
  id: keyof T;
  label: string;
}

type CellRenderers<T> = {
  [K in keyof T]?: (value: T[K], row: T) => ReactNode;
};

interface TableProps<T extends TableRowType> {
  data: T[];
  labels?: Partial<Record<keyof T, string>>;
  cellRenderers?: CellRenderers<T>;
  tableTitle?: string;
  tableSort?: string;
  tableType:
    | "reservation"
    | "calibration"
    | "assignment"
    | "equipment"
    | "user"
    | "fault"
    | "history"
    | "ACTIVITIES";

  onRowContextMenu?: (
    e: MouseEvent<HTMLTableRowElement>,
    row: T,
    tableType:
      | "reservation"
      | "calibration"
      | "assignment"
      | "equipment"
      | "user"
      | "fault"
      | "history"
      | "ACTIVITIES",
  ) => void;
  totalPageNumber: number;
  changePageFunction: (obj: PageableProps) => void;
}

export const Table = <T extends TableRowType>({
  data,
  labels,
  cellRenderers,
  tableTitle = "",
  tableSort,
  onRowContextMenu,
  tableType,
  totalPageNumber,
  changePageFunction,
}: TableProps<T>) => {
  const tableColumns: TableColumn<T>[] = Object.keys(labels ?? {}).map(
    (key) => ({
      id: key as keyof T,
      label: (labels?.[key as keyof T] ?? String(key)).toUpperCase(),
    }),
  );

  const [sortPage, setSortPage] = useState<PageableProps>({
    sortBy: "id",
    ascending: false,
    table: tableType,
    page: 0,
    size: 5,
    request: null,
  });

  const [reset, setReset] = useState<boolean>(false);

  if (data.length === 0) return null;

  return (
    <div className="surface-card my-2 min-w-0 overflow-hidden text-left">
      {tableTitle && (
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {tableTitle}
          </h2>
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-max text-sm text-slate-600">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {tableColumns.map((column) => (
                <th
                  className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold transition-colors hover:bg-slate-100 hover:text-brand-700"
                  key={String(column.id)}
                  onClick={() => makeVisible(String(column.id))}
                >
                  <div className="flex items-center gap-1.5">
                    {column.label}
                    <FaLongArrowAltDown
                      className={
                        sortPage.sortBy === String(column.id)
                          ? sortPage.ascending === true
                            ? "rotate-180"
                            : ""
                          : "invisible"
                      }
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 bg-white transition-colors last:border-b-0 hover:bg-brand-50/50"
                onContextMenu={(e) =>
                  onRowContextMenu ? onRowContextMenu(e, row, tableType) : null
                }
              >
                {tableColumns.map((column) => (
                  <td className="max-w-72 px-4 py-3" key={String(column.id)}>
                    {renderCell(column.id, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationButtons
        key={String(reset)}
        numButtons={totalPageNumber}
        onPageChange={handlePageChange}
        toFirstPage={reset}
      />
    </div>
  );

  function handlePageChange(currentPage: number) {
    const newSortPage = {
      ...sortPage,
      page: currentPage,
    };
    changePageFunction(newSortPage);
  }

  function makeVisible(el: string) {
    const direction =
      sortPage.sortBy === el && sortPage.ascending ? false : true;

    const newSortPage = {
      ...sortPage,
      table: tableSort,
      sortBy: el,
      ascending: direction,
      page: 0,
    };
    setReset(!reset);
    setSortPage(newSortPage);
    changePageFunction(newSortPage);
  }

  function renderCell<K extends keyof T>(columnId: K, row: T) {
    const renderer = cellRenderers?.[columnId];
    return renderer
      ? renderer(row[columnId], row)
      : String(row[columnId] ?? "");
  }
};
