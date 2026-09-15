

export interface FileInputProps {
  register?: any;
  value?: string;
  id: string;
  labelId: string;
  labelTitle: string;
}

export const FileInput = ({
  register,
  id,
  labelId,
  labelTitle,
}: FileInputProps) => {
  return (
    <>
      <div className="flex w-full flex-col">
        {labelId && labelTitle && <label className="field-label" htmlFor={labelId}>{labelTitle}</label>}

        <input
          className="field-control block file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
          type="file"
          accept=".jpg, .png, .gif, .webp"
          id={id}
          {...register}
        />
      </div>
    </>
  );
};
