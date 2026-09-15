import { Form } from "../Forms/Form";
import { PrimaryButton } from "../Buttons/PrimaryButton";
import type { GenericFilterProps } from "../../api/equipments/equipments";
import { useState } from "react";

export const GenericFilter = ({
  ResetItems,
  ButtonDisable,
  children,
  onSubmit,
}: GenericFilterProps) => {
  const [filter, showFilter] = useState<boolean>(false);

  return (
    <>
      <div className="m-4">
        <h3
          className={`inline px-5 py-2.5 pb-0.5 text-sm font-medium transition-all duration-200 border-b-2 hover:cursor-pointer ${
            filter
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
          onClick={() => {
            showFilter((prev) => !prev);
            ResetItems();
          }}
        >
          Prikaži filtere
        </h3>
      </div>
      <div
        className={`
       p-2
        transition-opacity duration-300 ease-in-out
        ${filter ? "visible opacity-100" : "hidden opacity-0 pointer-events-none"}
      `}
      >
        <Form enctype={undefined} onSubmit={onSubmit}>
          <div className="flex flex-row gap-2">{children}</div>

          <div className="flex gap-2 p-2">
            <PrimaryButton
              isDisable={ButtonDisable}
              buttonType="submit"
              buttonText="POTVRDI"
            />

            <PrimaryButton
              buttonColor="white"
              buttonText="RESTART"
              buttonType="button"
              onClick={ResetItems}
            />
          </div>
        </Form>
      </div>
    </>
  );
};
