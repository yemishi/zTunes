
interface Props extends React.HTMLAttributes<HTMLDivElement> {
    error: boolean,
    children?: React.ReactNode,
    message?: string,
}

export default function ErrorWrapper({
    children,
    error,
    message = "Something went wrong.",
    ...props
}: Props) {

    if (error) return <div className={`${props.className ? props.className : ""} w-fit text-lg shadow-md font-bold rounded-lg shadow-gray-400 text-center py-2 px-4`}>
        {message}</div>;
    return <>{children}</>;
}