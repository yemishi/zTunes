import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useLike from "./useLike";

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useLike", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches liked state", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(true),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useLike("123", "yemishi"), {
      wrapper: createWrapper(),
    });

    await act(() => Promise.resolve());

    expect(result.current.isLoading).toBe(true);
    expect(fetch).toHaveBeenCalledWith("/api/song/likedSong?username=yemishi&songId=123");
  });

  it("toggles like state and rolls back on error", async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => false,
      })
      .mockResolvedValueOnce({
        json: async () => ({ error: true }),
      });

    global.fetch = mockFetch as any;

    const { result } = renderHook(() => useLike("abc", "testuser"), {
      wrapper: createWrapper(),
    });

    await act(() => Promise.resolve());
    expect(result.current.isLiked).toBe(false);

    await act(async () => {
      await result.current.toggleLike();
    });

    expect(result.current.isLiked).toBe(false);
  });
});
