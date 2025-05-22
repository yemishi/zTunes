import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SongOptions from "@/components/songOptions/songOptions";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SongType } from "@/types/response";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const withQueryClient = (ui: ReactNode) => (
  <QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>
);

jest.mock("@/hooks/useLike/useLike", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isLiked: false,
    isLoading: false,
    toggleLike: jest.fn(),
  })),
}));
jest.mock("@/utils/helpers", () => ({
  removeFromPlaylist: jest.fn(() => Promise.resolve({ message: "Removed", error: false })),
  cleanClasses: (...classes: string[]) => classes.join(" "),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("SongOptions", () => {
  const baseProps = {
    song: {
      id: "song-1",
      artistId: "artist-1",
      album: { id: "album-1", name: "album-1", vibrantColor: { color: "#0000", isLight: false } },
      createdAt: new Date(),
      artistName: "artist-test",
      coverPhoto: "https://coverPhoto.jpg",
      error: false,
      name: "peak song",
      track: { duration: 1, url: "great-song-url" },
    } as SongType,
    username: "testuser",
    refetch: jest.fn(),
  };

  it("opens and closes the options menu", () => {
    render(withQueryClient(<SongOptions {...baseProps} />));
    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.getByText(/See Artist/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(screen.queryByText(/See Artist/i)).not.toBeInTheDocument();
  });
});
