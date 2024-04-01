import { ErrorType } from "@/types/response";
import Button from "../ui/buttons/Button";
import DivAnimated from "../ui/custom/DivAnimated";
import { format } from "date-fns";
import Link from "next/link";

type PropsType = {
  name: String;
  email: String;
  bDay: String;
  response?: ErrorType;
};

export default function ConfirmInfo({
  email,
  name,
  bDay,
  response,
}: PropsType) {
  const [day, month, year] = bDay.split("/");
  const formattedDate = format(String(Number(month) + 1), "LLLL");

  return (
    <DivAnimated key="confirmInfo" className="flex flex-col h-full gap-5">
      <div className="flex border-l-4 border-orange-600 pl-1 flex-col text-left gap-1 font-poppins text-lg mt-4 ml-4">
        <p>{`${day} of ${formattedDate} of ${year}`}</p>
        <p>{email}</p>
        <p>{name}</p>
      </div>

      <div
        className={`${
          response ? "bg-opacity-35" : "bg-opacity-20"
        } font-kanit text-xl bg-white px-3 py-5 rounded-lg border border-white border-opacity-50 mt-3`}
      >
        <p className="px-3 font-medium">
          {response ? response.message : "If everything is right click below"}
        </p>
      </div>
      {response ? (
        <Button asChild={true} className="bg-green-700 mt-auto">
          <Link href="/sign-in">Login</Link>
        </Button>
      ) : (
        <Button type="submit" className="text-black mt-auto ">
          Everything is right!
        </Button>
      )}
    </DivAnimated>
  );
}
