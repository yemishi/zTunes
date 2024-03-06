import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BundleOrganizer from "./BundleOrganizer";
import { BundleType, SongType } from "@/types/response";
import ArtistsOrganizer from "./ArtistsOrganizer";
import SongsOrganizer from "./SongsOrganizer";
import Provider from "@/context/Provider";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: () => null,
    };
  },
}));

describe("BundleOrganizer Component", () => {
  const sampleProps: BundleType[] = [
    {
      artistName: "test",
      avatar: "https://test.png",
      artistId: "artist1",
      coverPhoto: "https://test.png",
      createdAt: new Date(),
      id: "1",
      title: "test title",
      type: "album",
      error: false,
    },
  ];

  it("renders bundleOrganizer correctly", () => {
    const { getByText } = render(
      <BundleOrganizer baseUrl="test" title="Test bundle" props={sampleProps} />
    );
    sampleProps.forEach((item) => {
      expect(getByText(item.title)).toBeInTheDocument();
      expect(getByText(item.artistName)).toBeInTheDocument();
    });
    expect(getByText("Test bundle")).toBeInTheDocument();
  });
});

describe("ArtistOrganizer Component", () => {
  const sampleProps = [
    {
      cover: "https://test.png",
      id: "1",
      name: "Test name",
      error: false,
    },
  ];

  it("renders ArtistOrganizer correctly", () => {
    const { getByText } = render(
      <ArtistsOrganizer title="Test Artist" props={sampleProps} />
    );
    sampleProps.forEach((item) =>
      expect(getByText(item.name)).toBeInTheDocument()
    );
    expect(getByText("Test Artist")).toBeInTheDocument();
  });
});

describe("SongOrganizer Component", () => {
  const sampleProps: SongType[] = [
    {
      coverPhoto: "https://test.png",
      id: "1",
      name: "Test name",
      error: false,
      albumId: "album1",
      albumTitle: "Test Album",
      artistId: "artist1",
      artistName: "Test Artist",
      createdAt: new Date(),
      urlSong: "https://songtest",
    },
  ];

  it("renders ArtistOrganizer correctly", () => {
    const { getByText } = render(
      <Provider session={null}>
        <SongsOrganizer title="Test Song" songs={sampleProps} />
      </Provider>
    );
    sampleProps.forEach((item) => {
      expect(getByText(item.artistName)).toBeInTheDocument();
      expect(getByText(item.name)).toBeInTheDocument();
    });
    expect(getByText("Test Song")).toBeInTheDocument();
  });
});
