import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BundleOrganizer from "./BundleOrganizer";
import { BundleType } from "@/types/response";
import ProfileOrganizer from "./ProfileOrganizer";

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
      message: "",
      status: 200
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
      isArtist: true,
    },
  ];

  it("renders ArtistOrganizer correctly", () => {
    const { getByText } = render(
      <ProfileOrganizer title="Test Artist" props={sampleProps} />
    );
    sampleProps.forEach((item) =>
      expect(getByText(item.name)).toBeInTheDocument()
    );
    expect(getByText("Test Artist")).toBeInTheDocument();
  });
});
