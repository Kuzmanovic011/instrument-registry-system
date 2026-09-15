import "../../style.css";

interface InputProps {
  picturePath?: string;
  placeHolder: string;
  typeInput?: string;
  register?: any;
  error?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  labelTitle?: string;
  labelId?: string;
  autoCompleteTxt?: string;
}

export const Input = ({
  picturePath,
  placeHolder,
  register,
  typeInput = "text",
  value,
  onChange,
  id,
  labelId,
  labelTitle,
  autoCompleteTxt,
}: InputProps) => {
  return (
    <div className="relative w-full">
      {typeof picturePath !== "undefined" && (
        <img
          src={picturePath}
          alt="img_alt"
          className="pointer-events-none absolute bottom-[9px] left-3 h-6 w-6 object-contain opacity-60"
        />
      )}
      <div className="flex w-full flex-col">
        {typeof picturePath == "undefined" &&
          labelId?.length != 0 &&
          labelTitle?.length != 0 && (
            <label className="field-label" htmlFor={labelId}>
              {labelTitle}
            </label>
          )}

        <input
          className={`field-control ${picturePath ? "pl-11" : ""}`}
          type={typeInput}
          placeholder={placeHolder}
          {...(register ? register : { value, onChange })} //za obican input mora value i onChange a ne register
          id={id}
          autoComplete={autoCompleteTxt}
        />
      </div>
    </div>
  );
};
