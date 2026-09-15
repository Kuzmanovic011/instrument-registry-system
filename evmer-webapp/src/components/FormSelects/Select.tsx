export interface Categories {
  id: number;
  name: string;
}

export interface SelectProps {
  optionValues: string[] | number[] | Categories[];
  register?: any;
  id: string;
  defaultValue: string;
  labelId?: string;
  labelTitle?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({
  optionValues,
  register,
  id,
  defaultValue,
  labelId,
  labelTitle,
  onChange,
}: SelectProps) => {
  return (
    <>
      <div className="flex w-full flex-col">
        {labelTitle && (
          <label className="field-label" htmlFor={labelId}>
            {labelTitle}
          </label>
        )}

        <select
          className="field-control block cursor-pointer appearance-auto"
          id={id}
          onChange={onChange}
          {...register}
          defaultValue=""
        >
          <option value="">{defaultValue}</option>
          {(optionValues ?? []).map((el, index) => (
            <option key={index} value={typeof el === "object" ? el.id : el}>
              {typeof el === "object" ? el.name : el}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
