import type { Categories } from "../../components/FormSelects/Select";
import { getRequest } from "../ApiFunctions";

export interface GlobalDataProps {
  equipmentCategories: Categories[];
  equipmentStatuses: string[];
  calibrationResults: string[];
  calibrationStatuses: string[];
  expectedTableSorts: string[];
  returnConditions: string[];
  faultReport: string[];
  userRoles: string[];
  userRolesUpdate: string[];
  historyEvents: string[];
}

export async function ReqSetGlobalData() {
  return await getRequest<GlobalDataProps>("/api/app-data");
}
