import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ArtistHeader from "./ArtistHeader";
import GenericHeader from "./GenericHeader";
import { SongType } from "@/types/response";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
}));

describe("ArtistHeader component", () => {
  const artistInfo = {
    artistId: "artist1",
    artistName: "artist test",
    cover: "https://coverTest",
  };

  it("render correctly", () => {
    const { getByText } = render(
      <ArtistHeader
        artistInfo={artistInfo}
        followersLength={0}
        isInclude={false}
        username="user test"
        vibrantColor="#ffff"
      />
    );

    const artistName = getByText(artistInfo.artistName);
    const isFollow = getByText(/follow/i);

    expect(isFollow).toBeTruthy();
    expect(artistName).toBeTruthy();
  });
});

describe("GenericHeader component", () => {
  const info = {
    avatar: "https://avatartest",
    title: "Header test",
    author: "author test",
    coverPhoto: "https://covertest",
    id: "1",
  };

  const songs: SongType[] = [
    {
      albumId: "album1",
      albumTitle: "album test",
      artistId: "artist1",
      artistName: "artist test",
      coverPhoto: "https://covertest",
      createdAt: new Date(),
      error: false,
      id: "1",
      name: "song test",
      urlSong: "https://songTest",
    },
  ];

  it("render correctly", () => {
    const { getByText } = render(
      <GenericHeader bgFrom="black" info={info} songs={songs} />
    );
    const title = getByText(info.title);
    const author = getByText(info.author);

    expect(title).toBeTruthy();
    expect(author).toBeTruthy();
  });
});
