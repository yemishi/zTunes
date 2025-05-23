"use client";

import { SongType } from "@/types/response";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface PlayerContextProps {
  player: SongType[] | undefined;
  setPlayer: React.Dispatch<React.SetStateAction<SongType[] | undefined>>;
  currSong: number | undefined;
  setCurrSong: React.Dispatch<React.SetStateAction<number | undefined>>;
  turnOnPlayer: (songs: SongType[], index: number) => void;
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

const queryClient = new QueryClient();

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayerContext must be used within a PlayerProvider");
  }
  return context;
};

export default function Provider({ children, session }: { children: React.ReactNode; session: Session | null }) {
  const [currSong, setCurrSong] = useState<number>();
  const [player, setPlayer] = useState<SongType[]>();

  const turnOnPlayer = (songs: SongType[], index: number) => {
    setPlayer(songs), setCurrSong(index);
  };
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <PlayerContext.Provider value={{ currSong, setCurrSong, player, setPlayer, turnOnPlayer }}>
          {children}
        </PlayerContext.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
