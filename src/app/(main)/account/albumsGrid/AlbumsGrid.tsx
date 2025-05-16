"use client";

import { BundleType } from "@/types/response";
import CardAcc from "../cardAcc/CardAcc";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Image from "@/ui/custom/Image";
import Button from "@/ui/buttons/Button";
import Link from "next/link";
import CreateAlbum from "../createAlbum/CreateAlbum";
import DivAnimated from "@/ui/custom/DivAnimated";

export default function AlbumsGrid({ props, artistId }: { props: BundleType[]; artistId: string }) {
  const [show, setShow] = useState(true);
  return (
    <div className="flex flex-col overflow-hidden">
      <CardAcc
        onClick={() => setShow(!show)}
        title="Albums"
        subTitle="see your albums"
        subTitleSimple
        arrowClass={show ? "rotate-180" : ""}
      />

      <AnimatePresence initial={false}>
        {show && (
          <div className="p-3 flex flex-col gap-3">
            <CreateAlbum artistId={artistId} />
            {props.map((item, index) => {
              const { title, coverPhoto, id } = item;
              return (
                <DivAnimated key={`${id}_${index}`} reverse oneSide className="flex gap-3 items-center p-2 ">
                  <Image src={coverPhoto} className="size-9 md:size-12" />
                  <p className="md:text-lg">{title}</p>
                  <Button className="ml-auto rounded-lg bg-white text-black text-sm md:text-base">
                    <Link href={`/account/album/${id}`}>See</Link>
                  </Button>
                </DivAnimated>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
