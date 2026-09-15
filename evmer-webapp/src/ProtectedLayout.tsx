import { Outlet } from "react-router";
import { useGlobalData } from "./api/GlobalData";
import { useEffect } from "react";
import { ReqSetGlobalData } from "./api/globalData/globalData";

export const ProtectedLayout = () => {
  const setGlobalData = useGlobalData((state) => state.setData);

  useEffect(() => {
    const loadGlobalData = async () => {
      try {
        const res = await ReqSetGlobalData();
        setGlobalData(res);
      } catch (error) {
        console.error("Greška pri učitavanju globalnih podataka:", error);
      }
    };

    loadGlobalData();
  }, [setGlobalData]);
  return <Outlet />;
};
