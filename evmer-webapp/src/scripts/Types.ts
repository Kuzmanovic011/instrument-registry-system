import type { FilterActiveAssignments } from "../api/assignments/assignments";
import type { FilterItemsProps } from "../api/equipments/equipments";
import type { FilterReservation } from "../api/reservations/reservations";

export interface uniVersalProps {
  [key: string]: string;
}

export interface PageableProps {
  page: number;
  table?: string;
  sortBy: string;
  ascending: boolean;
  size: number;
  request:
    | FilterItemsProps
    | FilterReservation
    | FilterActiveAssignments
    | null;
}
