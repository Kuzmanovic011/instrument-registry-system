type LoaderProps = {
  size?: "small" | "medium" | "large";
};

const Loader = ({ size = "large" }: LoaderProps) => {
  const sizeMap = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-10 h-10",
  };

  return (
    <>
      <div
        className={`${sizeMap[size]} border-4 border-grey-300 border-t-blue-500 rounded-full animate-spin`}
      />
      <p>Učitavanje...</p>
    </>
  );
};

export default Loader;
