import { useLoadingStore } from "../../api/LoadingStore";
import Loader from "./Loader";

export const GlobalLoader = () => {
  const loading = useLoadingStore((state) => state.loading);

  if (!loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/25 backdrop-blur-[1px]">
      <div className="rounded-xl bg-white p-5 shadow-xl"><Loader /></div>
    </div>
  );
};
