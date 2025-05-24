"use client";

import ErrorWrapper from "@/components/errorWrapper/ErrorWrapper";
import BundleOrganizer from "@/components/bundleGrid/BundleGrid";
import BundleStackSkeleton from "@/components/skeletons/bundle/BundleStackSkeleton";
import { BundleType } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export default function ArtistAlbums({ artistId }: { artistId: string }) {
  const queryFn = () => fetch(`/api/album?artistId=${artistId}`).then((res) => res.json());
  const { data, isLoading, isError } = useQuery({
    queryKey: ["artistAlbum", artistId],
    refetchOnWindowFocus: false,
    queryFn,
  });

  if (isLoading) return <BundleStackSkeleton count={10} />;
  const albums = data ? data.filter((album: BundleType) => album.type.toLowerCase() === "album") : [];

  const singles = data ? data.filter((album: BundleType) => album.type.toLowerCase() === "single") : [];
  return (
    <>
      {data && (
        <ErrorWrapper error={data.error || isError} message={data.message}>
          {!!albums.length && <BundleOrganizer baseUrl="/album" title="Albums" props={albums} />}

          {!!singles.length && <BundleOrganizer baseUrl="/album" title="Singles" props={singles} />}
        </ErrorWrapper>
      )}
    </>
  );
}
