import { GiAerialSignal } from "react-icons/gi";

export const Footer = () => {
  return (
    <>
      <footer className="flex justify-between border-t border-slate-200 bg-white px-4 py-3 text-center text-sm text-slate-500">
        <div className="flex items-center">
          <GiAerialSignal className="inline" />
          <p className="inline">IMP TELEKOMUNIKACIJE</p>
        </div>
        <div>
          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  );
};
