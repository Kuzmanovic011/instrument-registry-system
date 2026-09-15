import "../../style.css";

interface CheckBoxProps {
  id: string;
  register: any;
  labelId?: string;
  labelTitle?: string;
}

export const CheckBox = ({
  id,
  register,
  labelId,
  labelTitle,
}: CheckBoxProps) => {
  return (
    <>
      <div className="flex flex-col">
        {labelId && labelTitle && (
          <label className="field-label" htmlFor={labelId}>
            {labelTitle}
          </label>
        )}
        <input
          type="checkbox"
          id={id}
          {...register}
          className="my-1 h-4 w-4 cursor-pointer rounded border-slate-300 text-brand-600 accent-brand-600 focus:ring-brand-500"
        />
      </div>
    </>
  );
};
