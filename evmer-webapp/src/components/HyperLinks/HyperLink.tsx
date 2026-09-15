import type { MouseEventHandler } from "react";
import { Link } from "react-router";

type HyperLinkProps = {
  path?: string;
  linkText: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};

export const HyperLink = ({ path = "", linkText, onClick }: HyperLinkProps) => {
  return (
    <>
      <Link to={path} onClick={onClick} className="p-1 hover:underline">
        {linkText.toUpperCase()}
      </Link>
    </>
  );
};
