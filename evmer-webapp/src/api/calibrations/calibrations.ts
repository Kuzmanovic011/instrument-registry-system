import type { PageableProps } from "../../scripts/Types";
import { getRequest } from "../ApiFunctions";
import type { CalibrationResponse } from "../equipments/equipments";

export interface FilterCalibration {
  name?: string;
  from?: string;
  to?: string;
  calibrationStatus?: string;
}

export interface CalibrationFilterProps {
  FilterItems: (data: FilterCalibration) => void;
  ResetItems: () => void;
  statuses: string[];
}

export async function getCalibrations() {
  return await getRequest<CalibrationResponse>("/calibrations");
}

export async function ChangePageCalibrations(obj: PageableProps) {
  return await getRequest<CalibrationResponse>("/calibrations", obj);
}

export async function reqFilterCalibrations(obj: FilterCalibration) {
  return await getRequest<CalibrationResponse>("/calibrations", obj);
}
