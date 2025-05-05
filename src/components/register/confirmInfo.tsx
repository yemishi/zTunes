import { ErrorType } from "@/types/response";
import { format } from "date-fns";

type PropsType = {
  name: String;
  email: String;
  bDay: String;
  response?: ErrorType;
};

export default function ConfirmInfo({ email, name, bDay, response }: PropsType) {
  const [day, month, year] = bDay.split("/");
  const formattedDate = format(String(Number(month) + 1), "LLLL");

  return (
    <div className="flex flex-col h-full gap-6 p-4">
      <div className="flex flex-col gap-1 p-3 text-left border-l-4 border-orange-600 pl-4 font-poppins text-base sm:text-lg bg-orange-50/10 rounded-md shadow-sm">
        <p className="font-semibold text-orange-200">{name}</p>
        <p className="text-orange-100">{`${day} of ${formattedDate} of ${year}`}</p>
        <p className="text-orange-100">{email}</p>
      </div>

      <div
        className={`${
          response ? " border-green-300/50" : " border-white/50"
        } font-kanit text-lg sm:text-xl px-5 py-6 bg-white/20 rounded-xl border transition-colors `}
      >
        <p className="px-1 font-medium text-white">
          {response ? response.message : "If everything looks good, click below to continue."}
        </p>
      </div>
    </div>
  );
}
