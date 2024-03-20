import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useScrollQuery from "./useScrollQuery";
import useObject from "./useObject";

describe("useScrollQuery", () => {
  it("should return the correct values", () => {
    const queryClient = new QueryClient();

    const { result } = renderHook(
      () => useScrollQuery({ queryKey: ["key"], url: "/api/data" }),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    );

    expect(result.current.ref).toBeTruthy();
    expect(result.current.values).toBeTruthy();
    expect(result.current.values.length === 0).toBeTruthy();
  });
});

describe("useObject", () => {
  it("should render the initial state", () => {
    const initialState = {
      count: 0,
      test: false,
      title: "Initial Title",
    };

    const {
      result: {
        current: {
          state: { count, test, title },
        },
      },
    } = renderHook(() =>
      useObject<{
        count: number;
        test: boolean;
        title: string;
      }>(initialState)
    );

    expect(count).toBe(0);
    expect(test).toBe(false);
    expect(title).toBe("Initial Title");
  });
});
