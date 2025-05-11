"use client";

import ErrorWrapper from "@/components/errorWrapper/ErrorWrapper";
import BundleOrganizer from "@/components/bundleGrid/BundleGrid";
import BundleStackSkeleton from "@/components/skeletons/bundle/BundleStackSkeleton";
import { BundleType } from "@/types/response";
import { useEffect, useState } from "react";

export default function ArtistAlbums({ artistId }: { artistId: string }) {
  interface ResponseType extends Array<BundleType> {
    error: false;
    message: string;
  }
  const [data, setData] = useState<ResponseType>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchAlbums = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response: ResponseType = await fetch(`/api/album?artistId=${artistId}`).then((res) => res.json());
      setData(response);
      setIsLoading(false);
    };
    fetchAlbums();
  }, [artistId]);

  if (isLoading) return <BundleStackSkeleton count={10} />;
  const albums = data ? data.filter((album: BundleType) => album.type.toLowerCase() === "album") : [];

  const singles = data ? data.filter((album: BundleType) => album.type.toLowerCase() === "single") : [];
  return (
    <>
      {data && (
        <ErrorWrapper error={data.error} message={data.message}>
          {!!albums.length && <BundleOrganizer baseUrl="/album" title="Albums" props={albums} />}

          {!!singles.length && <BundleOrganizer baseUrl="/album" title="Singles" props={singles} />}
        </ErrorWrapper>
      )}
    </>
  );
}
