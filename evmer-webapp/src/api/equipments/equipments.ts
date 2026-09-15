import type { PageableProps } from "../../scripts/Types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  patchRequestMultipart,
  patchRequestNoBody,
  postRequest,
  postRequestMultipart,
  type ResponseEntity,
} from "../ApiFunctions";
import type { ReactNode } from "react";
import type { EquipmentFaultReport } from "../faultReports/faultReports";
import type { DeleteReservationRequest } from "../reservations/reservations";
import type { Categories } from "../../components/FormSelects/Select";

export interface Equipment {
  id: number;
  name: string;
  desc: string;
  categoryName: number;
  manufacturer: string;
  manufacturerModel: string;
  serialNumber: string;
  purchaseYear: number;
  inventoryNumber: string;
  homeLocationDescription: string;
  status: string;
  calibrationRequired: boolean;
  lastCalibration: string;
  nextCalibration: string;
  calibrationResult: string;
  calibrationStatus: string;
  calibrationNote: string;
  parentEquipmentId: number;
  parentEquipmentName: string;
  accessories: string[];
  responsibleFirstName: string;
  responsibleLastName: string;
  expertFirstName: string;
  expertLastName: string;
  image: FileList;
  notes: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deleted: boolean;
}

export interface AddEquipmentCategoryDialogProps {
  cancelClick: () => void;
  showMenu: boolean;
  AddEquipmentCategory: (data: AddEquipmentCategoryProps) => void;
}

export interface Unassign {
  desc: string | undefined;
  severity: string | undefined;
  returnNote: string | undefined;
  returnCondition: string | undefined;
}

export interface Calibration {
  idEquipment: number;
  name: string;
  lastCalibration: string;
  nextCalibration: string;
  calibrationStatus: string;
  calibrationNote: string;
}

interface Calibrations extends Calibration {
  calibrationResult: string;
}

export interface CalibrationResponse {
  calibrations: Calibrations[];
  numPageCalibrations: number;
}

export interface addCalibrationEquipmentProps {
  lastCalibration?: string;
  nextCalibration?: string;
  calibrationResult?: string;
  calibrationNote?: string;
}

export interface AddEquipmentCategoryProps {
  name: string;
  desc: string;
}

export interface EquipmentType {
  equipment: Equipment[];
  equipmentNumPage: number;
}

export interface EquipmentFilterProps {
  FilterItems: (data: FilterItemsProps) => void;
  ResetItems: () => void;
  categories?: Categories[];
}

export interface FilterItemsProps {
  name?: string;
  inventoryNumber?: string;
  serialNumber?: string;
  manufacturer?: string;
  manufacturerModel?: string;
  categoryId?: number;
  homeLocationDescription?: string;
}

export interface GenericFilterProps {
  ResetFields?: () => void;
  ResetItems: () => void;
  ButtonDisable: boolean;
  children: ReactNode[];
  onSubmit: any;
}

export async function getEquipment() {
  return await getRequest<EquipmentType>("/equipment");
}

export async function reqFilterItems(data: FilterItemsProps) {
  return await getRequest<EquipmentType>("/equipment", data);
}

export async function editEquipment(
  equipment: Partial<Equipment>,
  file?: File,
) {
  if (equipment.id && equipment.name)
    return await patchRequestMultipart<ResponseEntity, Partial<Equipment>>(
      `/equipment/edit/${equipment.id}`,
      {
        name: equipment.name,
        desc: equipment.desc,
        homeLocationDescription: equipment.homeLocationDescription,
        status: equipment.status,
        notes: equipment.notes,
      },
      file ? file : undefined,
    );
}

export async function addEquipment(data: Partial<Equipment>, file?: File) {
  return await postRequestMultipart<ResponseEntity, Partial<Equipment>>(
    "/equipment/add",
    data,
    file,
  );
}

export interface AssignEquipmentRequest {
  projectOrTask: string;
  assignmentNote?: string;
}

export async function assignEquipment(
  id: number,
  data: AssignEquipmentRequest,
) {
  return await postRequest<ResponseEntity, AssignEquipmentRequest>(
    `equipment/assign/${id}`,
    data,
  );
}

export async function unassignEquipment(id: number, data: Unassign) {
  return await patchRequest(`assignments/unassign/${id}`, data);
}

export async function restoreEquipment(id: number) {
  return await patchRequestNoBody<ResponseEntity>(`/equipment/restore/${id}`);
}

export async function deleteEquipment(id: number, data?: string) {
  return await deleteRequest<ResponseEntity, { note: string | undefined }>(
    `/equipment/${id}`,
    { note: data },
  );
}

export async function addCalibrationEquipment(
  id: number,
  data: addCalibrationEquipmentProps,
) {
  return await postRequest<ResponseEntity, addCalibrationEquipmentProps>(
    `/equipment/calibration/add/${id}`,
    data,
  );
}

export async function ScheduleCalibration(id: number, data: { date: string }) {
  return await postRequest<ResponseEntity, { date: string }>(
    `/equipment/calibration/schedule/${id}`,
    data,
  );
}

export async function equipmentFaultReport(
  id: number,
  data: EquipmentFaultReport,
) {
  return await postRequest<ResponseEntity, EquipmentFaultReport>(
    `/equipment/fault-report/${id}`,
    data,
  );
}

export async function reqAddEquipmentCategory(data: AddEquipmentCategoryProps) {
  return await postRequest<ResponseEntity, AddEquipmentCategoryProps>(
    "/category/add",
    data,
  );
}

export async function ChangePageEquipment(obj: PageableProps) {
  return await getRequest<EquipmentType>("/equipment", obj);
}

export async function reqFaultResolve(
  id: number,
  data: DeleteReservationRequest,
) {
  return await postRequest<ResponseEntity, DeleteReservationRequest>(
    `/equipment/fault-resolve/${id}`,
    data,
  );
}

export async function reqNumReservations(id: number) {
  return await getRequest<number>(`/equipment/reservations/${id}`);
}
