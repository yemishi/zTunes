import Sidebar from "@/components/sidebar/Sidebar";
import UnderBar from "@/components/underBar/underBar";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="pb-32 md:pb-20 md:pl-64 lg:pl-72 2xl:pl-80 3xl:pl-96">{children}</div>
      <UnderBar />
    </>
  );
}
