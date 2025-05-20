import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useScrollQuery from "./useScrollQuery";

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useScrollQuery", () => {
  let observerCallback: (entries: IntersectionObserverEntry[]) => void;

  beforeAll(() => {
    global.IntersectionObserver = class {
      constructor(cb: typeof observerCallback) {
        observerCallback = cb;
      }
      observe = jest.fn();
      disconnect = jest.fn();
    } as any;
  });

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches paginated data and flattens it", async () => {
    const mockData = [
      { hasMore: true, songs: [{ id: 1 }, { id: 2 }] },
      { hasMore: false, songs: [{ id: 3 }] },
    ];

    global.fetch = jest.fn((url: string) => {
      const urlObj = new URL("http://localhost" + url);
      const page = Number(urlObj.searchParams.get("page"));

      return Promise.resolve({
        json: () => Promise.resolve(mockData[page]),
      });
    }) as jest.Mock;

    const { result } = renderHook(
      () =>
        useScrollQuery<{ id: number }>({
          queryKey: ["test"],
          url: "/api/songs",
        }),
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(result.current.values).toEqual([{ id: 1 }, { id: 2 }]);
    });
    act(() => {
      observerCallback([{ isIntersecting: true }] as IntersectionObserverEntry[]);
    });
    await waitFor(() => {
      expect(result.current.values).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith("/api/songs?page=0");
      expect(global.fetch).toHaveBeenCalledWith("/api/songs?page=1");
    });
  });
});
