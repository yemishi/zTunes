import Link from "next/link";
import Button from "@/ui/buttons/Button";

export default function InvalidToken() {
  return (
    <div className="h-full w-full flex justify-center items-center px-3">
      <div
        className="bg-gradient-to-b from-zinc-950 to-transparent min-h-[500px] w-full rounded-lg text-gray-300 text-center 
        px-10 py-16 font-kanit gap-6 flex flex-col max-w-[450px]"
      >
        <h1 className="text-3xl text-white">Your Link Didn't Work</h1>
        <p>Try clicking the link in your email again.</p>
        <p>To generate a new email, please visit Account Management.</p>
        <Button className="mt-auto py-3">
          <Link href="/login">Manage Account</Link>
        </Button>
      </div>
    </div>
  );
}
