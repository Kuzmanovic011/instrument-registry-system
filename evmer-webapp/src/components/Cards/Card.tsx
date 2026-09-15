interface CardProps {
  title: string;
  value?: number;
}

export const Card = ({ title, value }: CardProps) => {
  return (
    <div
      className="surface-card min-w-0 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      <div className="flex flex-col text-center gap-2">
        <h2 className="text-sm font-medium text-slate-500">{title}</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-brand-700">{value}</p>
      </div>
    </div>
  );
};
