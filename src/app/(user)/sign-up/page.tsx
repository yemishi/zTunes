import SignUpForm from "@/components/form/SignUpForm";

export default async function page() {
  return (
    <div className="w-full bg-black h-full bg-music !bg-no-repeat relative !bg-cover !bg-center flex items-center justify-center
    flex-col">
      <div className="fixed bg-gradient-to-b from-transparent to-black w-full h-full " />
      <SignUpForm />
    </div>
  );
}
