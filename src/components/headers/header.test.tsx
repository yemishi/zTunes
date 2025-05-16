import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ProfileHeader from "./profileHeader/ProfileHeader";
import GenericHeader from "./genericHeader/GenericHeader";

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
});

describe("ProfileHeader component", () => {
  const profileInfo = {
    profileId: "artist1",
    profileName: "Artist test",
    cover: "https://coverTest",
  };

  it("render correctly", () => {
    const { getByText } = render(
      <ProfileHeader profileInfo={profileInfo} followersLength={0} isInclude={false} username="user test" />
    );

    const artistName = getByText(profileInfo.profileName);
    const isFollow = getByText(/follow/i);

    expect(isFollow).toBeTruthy();
    expect(artistName).toBeTruthy();
  });
});
