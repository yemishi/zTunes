import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GenericHeader from "./GenericHeader";

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: jest.fn(),
    }),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("@/ui", () => {
  const actual = jest.requireActual("@/ui");
  return {
    ...actual,
    EditableImage: ({ src }: any) => <img src={src} alt="mocked" />,
    InputText: ({ initialValue }: any) => <p>{initialValue}</p>,
    ExpandableText: ({ children }: any) => <p data-testid="expandable-text">{children}</p>,
    PreviousPage: () => <button data-testid="previous-page">Back</button>,
  };
});
jest.mock("@/utils/getVibrantColor", () => jest.fn(() => Promise.resolve({ color: "hotpink", isLight: true })));
jest.mock(
  "next/link",
  () =>
    ({ children }: any) =>
      children
);

describe("GenericHeader", () => {
  const mockProps = {
    info: {
      avatar: "/avatar.png",
      title: "Cool Playlist",
      author: "DJ Test",
      coverPhoto: "/cover.jpg",
      authorId: "dj123",
      isOwner: true,
      isPublic: true,
      desc: "This is a dope playlist",
      isUser: true,
      isOfficial: false,
      categories: ["Chill", "Lo-fi"],
      releasedDate: "01/01/2024",
      tracks: [
        { url: "/track1.mp3", duration: 120 },
        { url: "/track2.mp3", duration: 180 },
      ],
    },
    playlistId: "playlist123",
    updateUrl: "/api/playlist",
    username: "djtest",
    vibrantColor: { color: "#ff0000", isLight: false },
  };

  it("renders playlist info correctly", () => {
    render(<GenericHeader {...mockProps} />);

    expect(screen.getByText("Cool Playlist")).toBeInTheDocument();
    expect(screen.getByText("DJ Test")).toBeInTheDocument();
    expect(screen.getByText("5min")).toBeInTheDocument();
    expect(screen.getByText("2 songs")).toBeInTheDocument();
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
  });
});
