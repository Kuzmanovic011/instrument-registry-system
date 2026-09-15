import { Link } from "react-router";

const PageNotFound = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h1 className="mb-4 text-7xl font-bold tracking-tight text-brand-600">404</h1>

        <p className="mb-6 text-xl font-semibold text-slate-700">Stranica nije pronađena</p>

        <Link
          to="/"
          className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Povratak
        </Link>
      </div>
    </>
  );
};

export default PageNotFound;
