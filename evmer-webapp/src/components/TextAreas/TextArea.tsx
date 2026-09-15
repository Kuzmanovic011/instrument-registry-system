import "../../style.css";

interface TextAreaProps {
  register: any;
  id: string;
  labelId: string;
  labelTitle: string;
}

export const TextArea = ({
  register,
  id,
  labelId,
  labelTitle,
}: TextAreaProps) => {
  return (
    <>
      <div className="flex w-full flex-col">
        <label className="field-label" htmlFor={labelId}>
          {labelTitle}
        </label>
        <textarea
          name=""
          id={id}
          className="field-control block min-h-24 resize-y"
          {...register}
        ></textarea>
      </div>
    </>
  );
};
