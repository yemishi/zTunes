import SignUpForm from "@/components/form/SignUpForm";

export default async function page() {
 
  return (
    <div className="formPage">
      <div className="fixed bg-gradient-to-b from-transparent to-black w-full h-full " />
      <SignUpForm />
    </div>
  );
}
