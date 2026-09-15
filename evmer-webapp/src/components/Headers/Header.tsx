import { useState, useEffect } from "react";
import { getRole, getUser, removeUser } from "../../scripts/Session";
import { Link, useNavigate } from "react-router";
import { HyperLink } from "../HyperLinks/HyperLink";
import { assetUrl } from "../../config/paths";
import { FaArrowRightFromBracket, FaRegClock } from "react-icons/fa6";

export const Header = () => {
  const user = getUser();
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  const logout = () => {
    removeUser();
    navigate("/auth/logins");
  };

  return (
    <header className="border-b border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/">
          <img
            src={assetUrl("logo-IMP.png")}
            alt="IMP logo"
            className="block max-h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FaRegClock className="text-slate-400" />
          <span>
            {date.toLocaleDateString("sr-RS")}{" "}
            {date.toLocaleTimeString("sr-RS", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-4 py-2 sm:px-6">
        <div>
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-brand-700"
          >
            <img
              src={assetUrl("userLogo.png")}
              alt="Korisnički nalog"
              className="h-7 w-7 rounded-full border border-slate-200 bg-white p-1"
            />
            {/* Moj korisnički nalog */} [{getRole()}] {user?.last_name}{" "}
            {user?.first_name}
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-800">
          <FaArrowRightFromBracket />
          <HyperLink onClick={() => logout()} linkText="Izlogujte se" />
        </div>
      </div>
    </header>
  );
};
