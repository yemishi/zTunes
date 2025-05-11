import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CardSearch from "./components/cardSearch";
import HistoricSearch from "./components/HistoricSearch";
import { SongType } from "@/types/response";

interface SongDataSearch extends SongType {
  songSelected?: { createAt: string; songId: string };
}

export type SearchType = {
  refId: string;
  coverPhoto: string;
  type: string;
  songData?: SongDataSearch;
  desc?: string;
  title: string;
};

async function fetchData(q: string, username: string) {
  if (!q) return [];

  const data: SearchType[] = await fetch(`${process.env.URL}/api/search?q=${decodeURI(q)}&username=${username}`, {
    cache: "no-cache",
  }).then((res) => res.json());
  return data;
}

async function getHistoric(username: string) {
  const data: SearchType[] = await fetch(`${process.env.URL}/api/search?username=${username}&getHistory=true`).then(
    (res) => res.json()
  );

  return data;
}

export default async function Search(props: { searchParams: Promise<{ q: string }> }) {
  const searchParams = await props.searchParams;

  const { q } = searchParams;

  const session = await getServerSession(authOptions);
  const username = session?.user.name as string;

  if (!q && username) {
    const history = await getHistoric(username);
    return <>{history.length > 0 && <HistoricSearch username={username} historic={history} />}</>;
  }

  const data = await fetchData(q, username);

  return (
    <div className="flex flex-col gap-3">
      {data.length > 0 &&
        data.map((data, key) => {
          return <CardSearch key={`${data.refId}_${key}`} data={data} username={username} />;
        })}
    </div>
  );
}
