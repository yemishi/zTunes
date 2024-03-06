import SignUpForm from "@/app/components/form/SignUpForm";

export default async function page() {
  return (
    <div className="w-full bg-black h-full bg-[url(/musicBg.jpg)] !bg-no-repeat relative !bg-cover !bg-center flex items-center justify-center
    flex-col">
      <div className="fixed bg-gradient-to-b from-transparent to-black w-full h-full " />
      <SignUpForm />
    </div>
  );
}
