import "../../style.css";
import { Select } from "../FormSelects/Select";
import { useEffect, useRef, useState } from "react";

interface DateProps {
  id: string;
  register: any;
  labelId: string;
  labelTitle: string;
  idHours?: string;
  idMinutes?: string;
  setFormValue?: (value: string) => void;
  initialReset?: boolean | number;
}

interface DateTimePickerValues {
  Date: string;
  Hours: string;
  Minutes: string;
}

export const DateTimePicker = ({
  id,
  register,
  labelId,
  labelTitle,
  idHours,
  idMinutes,
  setFormValue,
  initialReset,
}: DateProps) => {
  const [values, setValues] = useState<DateTimePickerValues>({
    Date: "",
    Hours: "00",
    Minutes: "00",
  });
  useEffect(() => {
    setValues({
      Date: "",
      Hours: "00",
      Minutes: "00",
    });
  }, [initialReset]);

  const newValues =
    values.Date && values.Hours && values.Minutes
      ? values.Date + " " + values.Hours + ":" + values.Minutes
      : undefined;

  const setFormValueRef = useRef(setFormValue);

  useEffect(() => {
    setFormValueRef.current = setFormValue;
  }, [setFormValue]);

  useEffect(() => {
    if (setFormValueRef.current && newValues)
      setFormValueRef.current(newValues);
  }, [newValues, initialReset]);

  const nizMinuti: string[] = [];

  for (let i = 0; i <= 60; i += 5) {
    if (i < 10) nizMinuti.push("0" + String(i));
    else nizMinuti.push(String(i));
  }

  const nizSati: string[] = [];

  for (let i = 0; i < 24; i++) {
    if (i < 10) nizSati.push("0" + String(i));
    else nizSati.push(String(i));
  }

  return (
    <>
      <div className="flex w-full flex-col">
        {labelId && labelTitle && (
          <label className="field-label" htmlFor={labelId}>
            {labelTitle}
          </label>
        )}

        <input
          type="date"
          id={id}
          className="field-control"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValues((prev) => ({ ...prev, Date: e.target.value }))
          }
          value={values.Date}
        />
        <div
          className={`mt-3 grid grid-cols-2 gap-3 ${!idHours || !idMinutes ? "hidden" : ""}`}
        >
          <Select
            defaultValue="Odaberite sate"
            id={idHours ? idHours : "undefined"}
            labelTitle="Odaberite sate"
            optionValues={nizSati}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, Hours: e.target.value }))
            }
            value={values.Hours}
          />

          <Select
            defaultValue="Odaberite minute"
            id={idMinutes ? idMinutes : "undefined"}
            value={values.Minutes}
            labelTitle="Odaberite minute"
            optionValues={nizMinuti}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, Minutes: e.target.value }))
            }
          />
        </div>
        <input type="hidden" {...register} />
      </div>
    </>
  );
};
