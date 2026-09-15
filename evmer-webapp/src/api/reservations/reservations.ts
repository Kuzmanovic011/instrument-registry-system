import type { PageableProps } from "../../scripts/Types";
import {
  deleteRequest,
  getRequest,
  postRequest,
  type ResponseEntity,
} from "../ApiFunctions";

export type ReservationStatus =
  | "AKTIVNA"
  | "REALIZOVANA"
  | "OTKAZANA"
  | "ISTEKLA";

export interface FilterReservation {
  equipmentName?: string;
  userFirstName?: string;
  userLastName?: string;
  status?: ReservationStatus;
  from?: string;
  to?: string;
}

export const reservationStatusOptions = [
  "AKTIVNA",
  "REALIZOVANA",
  "OTKAZANA",
  "ISTEKLA",
];

export interface Reservation {
  idReservation: number;
  equipmentName: string;
  userFirstName: string;
  userLastName: string;
  reservedAt: string;
  status: string;
  note: string;
}
export interface ReservationResponse {
  reservations: Reservation[];
  numPageReservations: number;
}

export interface AddReservationRequest {
  note?: string;
}

export interface DeleteReservationRequest {
  note: string;
}

export interface ReservationFilterProps {
  FilterItems: (data: FilterReservation) => void;
  ResetItems: () => void;
}

export async function getReservation() {
  return await getRequest<ReservationResponse>("/reservation");
}

export async function deleteReservation(
  id: number,
  data: DeleteReservationRequest,
) {
  return await deleteRequest<ResponseEntity, DeleteReservationRequest>(
    `/reservation/cancel/${id}`,
    data,
  );
}

export async function addReservation(id: number, data: AddReservationRequest) {
  return await postRequest<ResponseEntity, AddReservationRequest>(
    `/reservation/add/${id}`,
    data,
  );
}

export async function ChangePageReservation(obj: PageableProps) {
  return await getRequest<ReservationResponse>("/reservation", obj);
}

export async function reqFilterReservation(obj: FilterReservation) {
  return await getRequest<ReservationResponse>("/reservation", obj);
}
