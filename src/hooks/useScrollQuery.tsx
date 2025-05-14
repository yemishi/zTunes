"use client";

import { ErrorType } from "@/types/response";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";

export default function useScrollQuery<T>({ queryKey, url, stop }: PropsType<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchData = async (page: number) => {
    const mark = url.includes("?") ? "&" : "?";
    const data: { hasMore: boolean; error: false } | ErrorType = await fetch(`${url}${mark}page=${page - 1}`).then(
      (res) => res.json()
    );

    if (data.error) throw new Error(data.message);

    return data as T;
  };

  const { data, ...rest } = useInfiniteQuery<T>({
    queryKey,
    queryFn: ({ pageParam }) => fetchData(pageParam as number),
    getNextPageParam: (lastPage, allPages) => {
      const oldPage = lastPage as { hasMore: boolean };
      return oldPage.hasMore && !stop ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  const values = useMemo(() => {
    if (!data) return [];

    const result = data.pages.reduce((acc: T[], curr: any) => {
      const { hasMore, ...rest } = curr;
      const values = Object.values(rest)[0] as T[];
      const currArr = Array.isArray(values) ? values : (Array.from(values) as T[]);

      return [...acc, ...currArr];
    }, []);
    return result;
  }, [data]);

  useEffect(() => {
    if (!rest.isLoading && rest.hasNextPage) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !rest.isFetchingNextPage) rest.fetchNextPage();
      });
      if (ref.current) observer.current.observe(ref.current);
    }
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [rest.isFetchingNextPage, rest.hasNextPage, rest.fetchNextPage]);

  return {
    ref,
    values,
    ...rest,
  };
}

type PropsType<T> = {
  url: string;
  queryKey: string[];
  stop?: boolean;
};
