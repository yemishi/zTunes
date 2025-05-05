import AlbumForm from "@/components/form/AlbumForm";
import DivAnimated from "@/components/ui/custom/DivAnimated";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { useTempOverlay } from "@/context/Provider";

import { useState } from "react";

export default function AddAlbum({ artistId }: { artistId: string }) {
  const [title, setTitle] = useState<string>("");
  const { close, setChildren } = useTempOverlay();
  const Form = () => <AlbumForm artistId={artistId} title={title} onclose={close} />;

  return (
    <>
      <DivAnimated oneSide onClick={(e) => e.stopPropagation()} className=" flex items-center px-2">
        <Input label="New album name" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={() => setChildren(Form)} className="ml-auto rounded-lg text-sm text-black">
          New
        </Button>
      </DivAnimated>
    </>
  );
}
