import type { PageableProps } from "../../scripts/Types";
import { getRequest } from "../ApiFunctions";

export interface EquipmentFaultReport {
  desc: string;
  severity: string;
  reportType: string;
}

export interface Fault {
  equipmentName: string;
  userFirstName: string;
  userLastName: string;
  reportedAt: Date;
  desc: string;
  severity: string;
  status: boolean;
  resolvedAt: Date;
  resolutionNote: string;
}

export interface ReportFilterProps {
  FilterItems: (data: FilterFaultProps) => void;
  ResetItems: () => void;
}

export interface FilterFaultProps {
  equipmentName?: string;
  userFirstName?: string;
  userLastName?: string;
  reportedAt?: string;
  severity?: string;
  status?: boolean;
}

export interface FaultResponse {
  reports: Fault[];
  reportsPage: number;
}

export interface ReportFaultDialogProps {
  idFaultReport: number | undefined;
  cancelClick: () => void;
  showMenu: boolean;
  modalTitle: string;
  reportFault: (id: number, data: EquipmentFaultReport) => void;
}

export async function getFault() {
  return await getRequest<FaultResponse>("/fault-report");
}

export async function ChangePageFault(obj: PageableProps) {
  return await getRequest<FaultResponse>("/fault-report", obj);
}

export async function reqFilterFaults(data: FilterFaultProps) {
  return await getRequest<FaultResponse>("/fault-report", data);
}
