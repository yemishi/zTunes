import ResetPassForm from "@/app/components/form/ResetPassForm";
import InvalidToken from "@/app/components/user/invalidToken";
import Jwt from "jsonwebtoken";

async function getData(token: string) {
  try {
    type TokenType = {
      id: string;
    };
    const decode = Jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenType;

    return {
      error: false,
      id: decode.id,
    };
  } catch (error) {
    return {
      error: true,
    };
  }
}

export default async function page(context: {
  searchParams: {
    token: string;
  };
}) {
  const { error, id } = await getData(context.searchParams.token);
  if (error) return <InvalidToken />;
  return (
    <div
      className="w-full min-h-full !bg-[url(/musicBg.jpg)] !bg-no-repeat relative !bg-cover !bg-center flex 
    items-center justify-center overflow-x-hidden "
    >
      <div className="fixed bg-gradient-to-b from-transparent to-black w-full h-full " />
      <ResetPassForm userId={id as string} />
    </div>
  );
}
