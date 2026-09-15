import "../../style.css";

interface ErrorProps {
  message: string;
  atribute: boolean;
}

export const BasicError = ({ message, atribute }: ErrorProps) => {
  if (!atribute) return null;
  return (
    <>
      <div className="bg-red-500 p-2">
        <span className="text-white uppercase">{message}</span>
      </div>
    </>
  );
};
