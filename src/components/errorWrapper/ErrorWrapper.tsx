interface Props extends React.HTMLAttributes<HTMLDivElement> {
  error: boolean;
  children?: React.ReactNode;
  message?: string;
  refetch?: () => void;
}

export default function ErrorWrapper({ refetch, children, error, message = "Something went wrong.", ...props }: Props) {
  if (error)
    return (
      <div
        onClick={() => {
          if (refetch) refetch();
        }}
        className={`${props.className ? props.className : ""} ${refetch ? "cursor-pointer hover:brightness-90 transition-all" : ""} w-fit text-lg shadow-md font-bold rounded-lg shadow-gray-400 text-center py-2 px-4`}
      >
        {message}
      </div>
    );
  return <>{children}</>;
}
