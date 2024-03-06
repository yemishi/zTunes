import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import SongOptions from "./songOptions";
import { SongType } from "@/types/response";
import Provider from "@/context/Provider";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      refresh: () => null,
    };
  },
}));

describe("SongOptions component", () => {
  const song: SongType = {
    albumId: "album1",
    albumTitle: "album test",
    artistId: "artist1",
    artistName: "artist test",
    coverPhoto: "http://photoTest",
    createdAt: new Date(),
    error: false,
    id: "1",
    name: "song test",
    urlSong: "http://urltest",
  };

  it("render correctly", () => {
    const { getByText } = render(
      <Provider session={null}>
        <SongOptions
          onclose={() => {}}
          song={song}
          toPlaylist={() => {}}
          username="user test"
        />
      </Provider>
    );
    const artistName = getByText(song.artistName);
    const username = getByText(song.name);
    const albumLink = getByText(/see album/i);
    const artistLink = getByText(/see artist/i);
    const toPlaylist = getByText(/add to a playlist/i);
    const close = getByText(/close/i);

    expect(artistName).toBeTruthy();
    expect(username).toBeTruthy();
    expect(albumLink).toBeTruthy();
    expect(artistLink).toBeTruthy();
    expect(toPlaylist).toBeTruthy();
    expect(close).toBeTruthy();
  });
});
