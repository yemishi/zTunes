
import LibHeader from "./LibHeader";

export default async function LibLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <LibHeader />
      {children}
    </div>
  );
}
