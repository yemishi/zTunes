import SearchInput from "./components/searchInput";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <SearchInput />
      {children}
    </div>
  );
}
