import { act, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileHeader from "./ProfileHeader";
import GenericHeader from "./GenericHeader";
import { SongType } from "@/types/response";

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { name: "userTest" },
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" };
    }),
  };
});

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
}));

global.fetch = jest.fn().mockResolvedValue({
  json: () => Promise.resolve("black"),
});

describe("ProfileHeader component", () => {
  const profileInfo = {
    profileId: "artist1",
    profileName: "Artist test",
    cover: "https://coverTest",
  };

  it("render correctly", () => {
    const { getByText } = render(
      <ProfileHeader
        profileInfo={profileInfo}
        followersLength={0}
        isInclude={false}
        username="user test"
        vibrantColor="#ffff"
      />
    );

    const artistName = getByText(profileInfo.profileName);
    const isFollow = getByText(/follow/i);

    expect(isFollow).toBeTruthy();
    expect(artistName).toBeTruthy();
  });
});

describe("GenericHeader component", () => {
  beforeEach(() => {
    class MockAudio extends HTMLAudioElement {
      constructor() {
        super();
        this.load = jest.fn();
      }
    }
    window.Audio = MockAudio;
  });

  const info = {
    avatar: "https://avatartest",
    title: "Header test",
    author: "author test",
    coverPhoto: "https://covertest",
    authorId: "author1",
    isOwner: false,
    id: "1",
    urlsSongs: [""],
  };

  const songs: SongType[] = [
    {
      albumId: "album1",
      albumName: "album test",
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

  it("should render correctly", async () => {
    const { getByText } = render(<GenericHeader info={info} />);
    await waitFor(() => {
      const title = getByText(info.title);
      const author = getByText(info.author);

      expect(title).toBeTruthy();
      expect(author).toBeTruthy();
    });
  });
});
