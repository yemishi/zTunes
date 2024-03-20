"use client";
import { BiSolidAlbum } from "react-icons/bi";
import { BundleType } from "@/types/response";
import { CardAcc } from "./CardAcc";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import Image from "@/app/components/ui/Image";
import Button from "@/app/components/ui/buttons/Button";
import Link from "next/link";
import AddAlbum from "./albumManager/AddAlbum";
import DivAnimated from "@/app/components/ui/DivAnimated";

export default function Albums({
  props,
  artistId,
}: {
  props: BundleType[];
  artistId: string;
}) {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="flex flex-col overflow-hidden">
      <CardAcc
        onClick={() => setShow(!show)}
        Icon={BiSolidAlbum}
        title="Albums"
        subTitle="see your albums"
        subTitleSimple
        arrowClass={show ? "rotate-180" : ""}
      />

      <AnimatePresence>
        {show && (
          <div className="p-3 flex flex-col gap-3">
            <AddAlbum artistId={artistId} />
            {props.map((item, index) => {
              const { title, coverPhoto, id } = item;
              return (
                <DivAnimated
                  key={`${id}_${index}`}
                  reverse
                  oneSide
                  className="flex gap-3 items-center p-2 "
                >
                  <Image src={coverPhoto} className="size-9" />
                  <p>{title}</p>
                  <Button
                    asChild
                    className="ml-auto rounded-lg bg-white text-black text-sm"
                  >
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
