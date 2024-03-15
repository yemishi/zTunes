import Button from "@/app/components/ui/buttons/Button";
import InvalidToken from "@/app/components/user/invalidToken";
import Jwt from "jsonwebtoken";
import Link from "next/link";

async function getData(token: string) {
  try {
    type DecodeType = {
      id: string;
    };
    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodeType;

    const body = {
      userId: decoded.id,
    };
    await fetch(`${process.env.URL}/api/user/validation`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    return {
      title: "You're All Set",
      message: "You have successfully verified your email address",
      info: "To make more changes, please visit Account Management",
    };
  } catch (err: any) {
    return {
      error: true,
    };
  }
}
export default async function page(context: {
  searchParams: { token: string };
}) {
  const { info, message, title, error } = await getData(
    context.searchParams.token
  );
  if (error) return <InvalidToken />;

  return (
    <div className="h-full w-full flex justify-center items-center px-3">
      <div
        className="bg-gradient-to-b from-zinc-950 to-transparent min-h-[500px] w-full rounded-lg text-gray-300 text-center 
      px-10 py-16 font-kanit gap-6 flex flex-col max-w-[450px]"
      >
        <h1 className="text-3xl text-white">{title}</h1>
        <p>{message}</p>
        <p>{info}</p>
        <Button className="mt-auto py-3" asChild>
          <Link href="/sign-in">Manage Account</Link>
        </Button>
      </div>
    </div>
  );
}
