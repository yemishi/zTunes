import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfileHeader from "./ProfileHeader";

jest.mock("next/router", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));
jest.mock("next-auth/react", () => ({
  useSession: () => ({ update: jest.fn() }),
}));

jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

jest.mock("@/utils/getVibrantColor", () => jest.fn(() => Promise.resolve({ color: "#ff00ff", isLight: true })));

jest.mock("@/ui", () => {
  const actual = jest.requireActual("@/ui");
  return {
    ...actual,
    ExpandableText: ({ children }: any) => <p data-testid="expandable-text">{children}</p>,
    InputText: ({ initialValue }: any) => <p data-testid="input-text">{initialValue}</p>,
    EditableImage: () => <div data-testid="editable-image">EditableImage</div>,
    PreviousPage: () => <button data-testid="previous-page">Back</button>,
  };
});
jest.mock("./toggleFollow/ToggleFollow", () => () => <button data-testid="toggle-follow">Follow</button>);

beforeEach(() => {
  (global.fetch as any) = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
});
describe("ProfileHeader", () => {
  const mockProps = {
    username: "alu",
    profileInfo: {
      profileName: "alu",
      profileId: "123",
      cover: "/cover.jpg",
      vibrantColor: { color: "black", isLight: false },
    },
    followersLength: 10,
    isArtist: false,
    isInclude: false,
    artistAbout: "Great artist ngl",
  };

  it("renders profile info correctly for owner", async () => {
    render(<ProfileHeader {...mockProps} />);

    expect(screen.getByTestId("editable-image")).toBeInTheDocument();
    expect(screen.getByTestId("input-text")).toHaveTextContent("alu");
    expect(screen.queryByTestId("toggle-follow")).not.toBeInTheDocument();
    expect(screen.getByText("10 Follows")).toBeInTheDocument();
    expect(screen.getByTestId("expandable-text")).toHaveTextContent("Great artist ngl");
  });

  it("renders follow button for non-owner", async () => {
    render(<ProfileHeader {...mockProps} username="someoneElse" />);

    expect(screen.getByTestId("toggle-follow")).toBeInTheDocument();
    expect(screen.getByText("10 Follows")).toBeInTheDocument();
  });

  it("shows fallback follow text if no followers", async () => {
    render(<ProfileHeader {...mockProps} followersLength={0} />);

    expect(screen.getByText("Be the first to follow")).toBeInTheDocument();
  });
});
