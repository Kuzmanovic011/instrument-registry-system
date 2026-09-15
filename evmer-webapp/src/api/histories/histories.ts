import type { PageableProps } from "../../scripts/Types";
import { getRequest } from "../ApiFunctions";

export interface History {
  equipmentName: string;
  userFirstName: string;
  userLastName: string;
  eventType: string;
  oldValue: string;
  newValue: string;
  performedAt: string;
  note: string;
}

export interface HistoryResponse {
  equipmentHistory: History[];
  numPagesHistory: number;
}



export interface FilterHistoryProps {
  equipmentName?: string;
  userFirstName?: string;
  userLastName?: string;
  eventType?: string;
  from?: string;
  to?: string;
}

export interface HistoryFilterProps {
  FilterItems: (data: FilterHistoryProps) => void;
  ResetItems: () => void;
  type: string[];
}

export async function getHistory() {
  return await getRequest<HistoryResponse>("/history");
}

export async function ChangePageHistory(obj: PageableProps) {
  return await getRequest<HistoryResponse>("/history", obj);
}

export async function reqFilterHistories(data: FilterHistoryProps) {
  return await getRequest<HistoryResponse>("/history", data);
}
