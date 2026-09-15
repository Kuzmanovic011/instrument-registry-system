import type { PageableProps } from "../../scripts/Types";
import { getRequest } from "../ApiFunctions";

export interface Assignment {
  id: number;
  username: string;
  userFirstName: string;
  userLastName: string;
  equipmentName: string;
  assignedAt: string;
  projectOrTask: string;
  assignmentNote: string;
  accessories: string[];
}

export interface HistoryAssignmentResponse {
  id: number;
  userUsername: string;
  userFirstName: string;
  userLastName: string;
  equipmentName: string;
  accessories: string[];
  eventType: string;
  oldValue: string;
  newValue: string;
  performedAt: Date;
  note: string;
}

export interface ActiveAssignmentResponse {
  id: number;
  userUsername: string;
  userFirstName: string;
  userLastName: string;
  equipmentName: string;
  projectOrTask: string;
  assignedAt: Date;
  accessories: string[];
  assignmentNote: string;
}

export interface FilterActiveAssignments {
  userFirstName?: string;
  userLastName?: string;
  equipmentName?: string;
  projectOrTask?: string;
  from?: string;
  to?: string;
}

export interface FilterHistoryAssignments {
  equipmentName?: string;
  userFirstName?: string;
  userLastName?: string;
  eventType?: string;
  performedAt?: string;
}

export interface AssignmentResponse {
  activeAssignments: ActiveAssignmentResponse[];
  numPageActiveAssignment: number | undefined;
  historyAssignments: HistoryAssignmentResponse[];
  numPageHistoryAssignment: number;
}

export interface AssignmentFilterProps {
  FilterItems: (data: FilterActiveAssignments) => void;
  ResetItems: () => void;
}

export async function ChangePageAssignment(obj: PageableProps) {
  return await getRequest<AssignmentResponse>("assignments", obj);
}

export async function reqFilterActiveAssignments(
  data: FilterActiveAssignments,
) {
  return await getRequest<AssignmentResponse>("/assignments", data);
}

export async function reqFilterHistoryAssignments(
  data: FilterHistoryAssignments,
) {
  return await getRequest<AssignmentResponse>("/assignments", data);
}

export async function getAssignment() {
  return await getRequest<AssignmentResponse>("/assignments");
}
