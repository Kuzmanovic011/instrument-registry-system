import type { ReactNode } from "react";

export interface Formprops {
  children: ReactNode[];
  formMethod?: string;
  onSubmit?: any;
  enctype: string | undefined;
}

export const Form = ({
  formMethod = "GET",
  children,
  onSubmit,
  enctype,
}: Formprops) => {
  return (
    <>
      <form method={formMethod} onSubmit={onSubmit} encType={enctype}>
        {children.map((el, index) => (
          <div key={index}>{el}</div>
        ))}
      </form>
    </>
  );
};
