import Sidebar from "@/components/sidebar/Sidebar";
import UnderBar from "@/components/underBar/underBar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="pb-32 flex flex-col md:pb-20 md:ml-62 lg:ml-70 2xl:ml-78 3xl:ml-94 bg-black-700 h-full overflow-y-auto md:rounded-xl overflow-hidden">
        {children}
      </div>
      <UnderBar />
    </>
  );
}
