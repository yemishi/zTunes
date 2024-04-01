import SearchInput from "./components/searchInput";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <SearchInput />
      {children}
    </div>
  );
}
