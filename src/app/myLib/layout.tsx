import LibHeader from "./libHeader/LibHeader";

export default async function LibLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <LibHeader />
      {children}
    </div>
  );
}
