import "../../style.css";
import { type Ref } from "react";
import { getRole } from "../../scripts/Session";
import type { TableRowType } from "../Tables/Table";

interface ContextMenuProps {
  makeAdministrator?: (id: number) => void;
  showMenu: boolean;
  menuRef: Ref<HTMLDivElement>;
  yPos: number;
  xPos: number;
  tableType?: "equipment" | "user" | "reservation";
  showEdit?: () => void;
  showDetails?: () => void;
  showAddCalibration?: () => void;
  showNextCalibration?: () => void;
  deleteDialog?: () => void;
  restoreFunction?: (id: number) => void;
  changeUserPassword?: () => void;
  selectedRow?: TableRowType;
  assignEquipment?: () => void;
  unassignEquipment?: () => void;
  reportFault?: () => void;
  addReservation?: () => void;
  deleteReservation?: () => void;
  editUser?: () => void;
  faultResolve?: () => void;
  onAction?: () => void;
}

export const ContextMenu = ({
  makeAdministrator,
  showMenu,
  menuRef,
  yPos,
  xPos,
  tableType,
  showEdit,
  showDetails,
  showAddCalibration,
  deleteDialog,
  restoreFunction,
  selectedRow,
  showNextCalibration,
  assignEquipment,
  unassignEquipment,
  reportFault,
  addReservation,
  deleteReservation,
  editUser,
  changeUserPassword,
  faultResolve,
  onAction,
}: ContextMenuProps) => {
  return (
    <>
      {showMenu ? (
        <div
          className="evmer-context-menu z-[60]"
          ref={menuRef}
          style={{
            top: yPos + "px",
            left: xPos + "px",
            position: "fixed",
          }}
        >
          <ul className="cursor-pointer" onClick={onAction}>
            {getRole() === "ADMINISTRATOR" && tableType === "equipment" && (
              <>
                <li
                  className="p-2 border-b-1 border-gray-400 hover:underline "
                  onClick={() => showEdit?.()}
                >
                  Izmeni
                </li>
                {selectedRow &&
                  "status" in selectedRow &&
                  selectedRow.status === "NEISPRAVAN" && (
                    <li
                      className="p-2 border-b-1 border-gray-400 hover:underline"
                      onClick={() => faultResolve?.()}
                    >
                      Rešavanje kvara
                    </li>
                  )}

                {tableType === "equipment" &&
                  selectedRow &&
                  "calibrationRequired" in selectedRow &&
                  selectedRow.calibrationRequired && (
                    <>
                      <li
                        className="p-2 border-b-1 border-gray-400 hover:underline "
                        onClick={() => showAddCalibration?.()}
                      >
                        Dodaj kalibraciju
                      </li>
                      <li
                        className="p-2 border-b-1 border-gray-400 hover:underline"
                        onClick={() => showNextCalibration?.()}
                      >
                        Zakaži kalibraciju
                      </li>
                    </>
                  )}
              </>
            )}
            {tableType === "equipment" &&
              getRole() === "ADMINISTRATOR" &&
              (selectedRow &&
              "deleted" in selectedRow &&
              selectedRow.deleted ? (
                <li
                  className="p-2 hover:underline border-b-1 border-gray-400"
                  onClick={() => {
                    if (selectedRow.id) {
                      restoreFunction?.(selectedRow.id);
                    }
                  }}
                >
                  Aktiviraj
                </li>
              ) : (
                <li
                  className="p-2 hover:underline border-b-1 border-gray-400"
                  onClick={() => {
                    deleteDialog?.();
                  }}
                >
                  Deaktiviraj
                </li>
              ))}
            {tableType === "user" &&
              getRole() === "ADMINISTRATOR" &&
              selectedRow &&
              "active" in selectedRow &&
              (selectedRow.active ? (
                <li
                  className="p-2 hover:underline border-b-1 border-gray-400"
                  onClick={() => deleteDialog?.()}
                >
                  Deaktiviraj
                </li>
              ) : (
                <li
                  className="p-2 hover:underline border-b-1 border-gray-400"
                  onClick={() => {
                    if (selectedRow.id) {
                      restoreFunction?.(selectedRow.id);
                    }
                  }}
                >
                  Aktiviraj
                </li>
              ))}
            {tableType === "equipment" && showDetails && (
              <li className="p-2 hover:underline" onClick={() => showDetails()}>
                Detalji
              </li>
            )}
            {tableType === "user" &&
              getRole() === "ADMINISTRATOR" &&
              selectedRow && (
                <li
                  className="p-2 hover:underline"
                  onClick={() => editUser?.()}
                >
                  Izmeni korisnika
                </li>
              )}
            {tableType === "equipment" &&
              selectedRow &&
              "status" in selectedRow &&
              (selectedRow.status === "SLOBODAN"
                ? assignEquipment && (
                    <li
                      className="p-2 hover:underline"
                      onClick={() => assignEquipment()}
                    >
                      Zaduži opremu
                    </li>
                  )
                : selectedRow.status === "ZAUZET"
                  ? unassignEquipment && (
                      <li
                        className="p-2 hover:underline"
                        onClick={() => unassignEquipment()}
                      >
                        Razduži opremu
                      </li>
                    )
                  : null)}
            {tableType === "equipment" &&
              selectedRow &&
              "status" in selectedRow &&
              (selectedRow.status === "SLOBODAN" ||
                selectedRow.status === "REZERVISAN") && (
                <li
                  className="p-2 hover:underline"
                  onClick={() => reportFault?.()}
                >
                  Prijavi kvar
                </li>
              )}
            {tableType === "equipment" &&
              selectedRow &&
              "status" in selectedRow &&
              selectedRow.status === "ZAUZET" && (
                <li
                  className="p-2 hover:underline"
                  onClick={() => addReservation?.()}
                >
                  Dodaj rezervaciju
                </li>
              )}
            {tableType === "reservation" && selectedRow && (
              <li
                className="p-2 hover:underline"
                onClick={() => deleteReservation?.()}
              >
                Otkaži rezervaciju
              </li>
            )}
            {tableType === "user" &&
              getRole() === "ADMINISTRATOR" &&
              selectedRow &&
              "role" in selectedRow &&
              selectedRow.role !== "ADMINISTRATOR" && (
                <li
                  className="p-2 hover:underline border-b-1 border-gray-400"
                  onClick={() => makeAdministrator?.(selectedRow.id)}
                >
                  Dodeli administratora
                </li>
              )}
            {tableType === "user" &&
              getRole() === "ADMINISTRATOR" &&
              selectedRow && (
                <li
                  className="p-2 hover:underline border-b-1 border-gray-400"
                  onClick={() => changeUserPassword?.()}
                >
                  Promeni lozinku korisnika
                </li>
              )}
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
