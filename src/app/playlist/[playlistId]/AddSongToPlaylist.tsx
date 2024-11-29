"use client"
import CardSearch from "@/app/search/components/cardSearch"
import { SearchType } from "@/app/search/page"
import useScrollQuery from "@/hooks/useScrollQuery"
import { useState } from "react"
import { IoArrowBackCircleOutline } from "react-icons/io5";

import Skeleton from "react-loading-skeleton"

export default function AddSongToPlaylist({ username, playlistId, onClose, refetch }: { username: string, playlistId: string, onClose: () => void, refetch: () => void }) {
    const [search, setSearch] = useState("")
    const { values, isFetchingNextPage, hasNextPage, ref, isLoading } = useScrollQuery<SearchType>({ queryKey: ["search-songs", search], url: `/api/search?onlySongs=true&q=${search}&username=${username}&playlistId=${playlistId}` })

    return <div className="w-[380px] h-[550px] md:h-[900px] md:w-[450px] flex flex-col gap-2 rounded-lg overflow-auto bg-black-450">
        <span className="w-full p-3 bg-black-600 z-10 flex justify-between md:text-lg sticky top-0 ">
            <input
                className="bg-transparent outline-none w-full"
                autoFocus
                placeholder="Search for music"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={onClose}>
                <IoArrowBackCircleOutline className="ml-auto size-9 mr-1" />
            </button>
        </span>

        {values && values.length > 0 && values.map((data, key) => {
            return <CardSearch
                data={data}
                refetch={refetch}
                playlistId={playlistId}
                key={`${data.refId}_${key}`}
                username={username}
            />
        })}
        {isLoading && Array.from({ length: 5 }).map((e, i) => <SongSearchSkeleton key={`${e}_${i}`} />)}
        {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
        {isFetchingNextPage && <SongSearchSkeleton />}
    </div>
}

const SongSearchSkeleton = () => <div className="flex items-center p-2 !justify-between w-[380px] md:w-[430px] ">
    <div className="flex gap-1 items-center">

        <Skeleton className="!size-12 !rounded-lg md:!size-16" />

        <Skeleton count={2} className="!w-32 !h-4 !rounded-lg" />
    </div>

    <Skeleton className="max-md:!hidden !rounded-full mr-3  !size-7 md:!size-8" />
</div>