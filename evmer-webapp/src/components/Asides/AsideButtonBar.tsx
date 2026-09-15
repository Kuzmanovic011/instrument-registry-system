import { AsideButton } from "../Buttons/AsideButton";
import { useLocation, useNavigate } from "react-router";
import { getRole } from "../../scripts/Session";
import {
  FaCalendarCheck,
  FaClockRotateLeft,
  FaGaugeHigh,
  FaScrewdriverWrench,
  FaTriangleExclamation,
  FaUserGroup,
  FaWrench,
} from "react-icons/fa6";

export const AsideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <aside className="border-r border-slate-200 bg-white px-3 py-5 max-sm:border-r-0 max-sm:border-b max-sm:py-2">
        <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 max-sm:hidden">
          Navigacija
        </div>
        <div className="flex flex-col gap-1 max-sm:flex-row max-sm:overflow-x-auto max-sm:pb-1">
        <AsideButton
          buttonText="Početna"
          icon={<FaGaugeHigh />}
          active={isActive("/index")}
          onClick={() => navigate("/index")}
        />
        {getRole() === "ADMINISTRATOR" && (
          <>
            <AsideButton
              buttonText="Korisnici"
              icon={<FaUserGroup />}
              active={isActive("/users")}
              onClick={() => navigate("/users")}
            />
            <AsideButton
              buttonText="Istorija"
              icon={<FaClockRotateLeft />}
              active={isActive("/history")}
              onClick={() => navigate("/history")}
            />
            <AsideButton
              buttonText="Kalibracije"
              icon={<FaScrewdriverWrench />}
              active={isActive("/calibrations")}
              onClick={() => navigate("/calibrations")}
            />
          </>
        )}
        {(getRole() === "ADMINISTRATOR" || getRole() === "MENADZER") && (
          <AsideButton
            buttonText="Kvarovi"
            icon={<FaTriangleExclamation />}
            active={isActive("/fault-report")}
            onClick={() => navigate("/fault-report")}
          />
        )}
        <AsideButton
          buttonText="Oprema"
          icon={<FaWrench />}
          active={isActive("/equipment")}
          onClick={() => navigate("/equipment")}
        />
        <AsideButton
          buttonText="Zaduženja"
          icon={<FaScrewdriverWrench />}
          active={isActive("/assignments")}
          onClick={() => navigate("/assignments")}
        />
        <AsideButton
          buttonText="Rezervacije"
          icon={<FaCalendarCheck />}
          active={isActive("/reservation")}
          onClick={() => navigate("/reservation")}
        />
        </div>
      </aside>
    </>
  );
};
