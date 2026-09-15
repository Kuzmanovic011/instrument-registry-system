import { useCallback, useEffect, useState, useRef } from "react";
import { type MouseEvent } from "react";
import type { selectedRowType } from "../Tables/Table";

export const useContextMenu = <T>() => {
  const [xPos, setXPos] = useState<number>(0);
  const [yPos, setYPos] = useState<number>(0);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedRow, setSelectedRow] = useState<selectedRowType<T> | null>(null);
  const closeContextMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleContextMenu = useCallback(
    //desni klik misa
    (e: MouseEvent<HTMLTableRowElement>, row: T, tableType :selectedRowType<T>["tableType"]) => {
      e.preventDefault();
      setSelectedRow({row, tableType});
      setXPos(e.clientX);
      setYPos(e.clientY);
      setShowMenu(true);
    },
    [],
  );

  useEffect(() => {
    if (!menuRef.current) {
      return;
    }

    const obj = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (yPos + obj.height > viewportHeight) setYPos(yPos - obj.height);

    if (xPos + obj.width > viewportWidth) setXPos(xPos - obj.width);
  }, [xPos, yPos]);

  const handleClick = useCallback((e: Event) => {
    //levi klik mista
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      closeContextMenu();
    }
  }, [closeContextMenu]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("scroll", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("scroll", handleClick);
    };
  }, [handleClick]);


  return {
    xPos,
    yPos,
    showMenu,
    selectedRow,
    menuRef,
    handleContextMenu,
    closeContextMenu,
  };
};
