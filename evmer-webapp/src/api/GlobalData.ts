import { create } from "zustand";
import type { GlobalDataProps } from "./globalData/globalData";

interface GlobalDataFunctions extends GlobalDataProps {
  setData: (data: GlobalDataProps) => void;
}

export const useGlobalData = create<GlobalDataFunctions>((set) => ({
  equipmentCategories: [],
  equipmentStatuses: [],
  calibrationResults: [],
  calibrationStatuses: [],
  expectedTableSorts: [],
  returnConditions: [],
  faultReport: [],
  userRoles: [],
  userRolesUpdate: [],
  historyEvents: [],

  setData: (data) => {
    set({
      equipmentCategories: data.equipmentCategories,
      equipmentStatuses: data.equipmentStatuses,
      calibrationResults: data.calibrationResults,
      calibrationStatuses: data.calibrationStatuses,
      expectedTableSorts: data.expectedTableSorts,
      returnConditions: data.returnConditions,
      faultReport: data.faultReport,
      userRoles: data.userRoles,
      userRolesUpdate: data.userRolesUpdate,
      historyEvents: data.historyEvents,
    });
  },
}));
