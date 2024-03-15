import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useScrollQuery from "./useScrollQuery";

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
