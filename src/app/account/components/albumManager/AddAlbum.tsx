import AlbumForm from "@/app/components/form/AlbumForm";
import DivAnimated from "@/app/components/ui/DivAnimated";
import Button from "@/app/components/ui/buttons/Button";
import Input from "@/app/components/ui/inputs/Input";

import { useState } from "react";

export default function AddAlbum({ artistId }: { artistId: string }) {
  const [isNew, setIsNew] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  return (
    <>
      <DivAnimated
        oneSide
        onClick={(e) => e.stopPropagation()}
        className=" flex items-center px-2"
      >
        <Input
          label=""
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New album name"
          classNameInput="bg-transparent border-gray-300 border-b-2"
        />
        <Button
          onClick={() => setIsNew(true)}
          className="ml-auto rounded-lg text-sm text-black"
        >
          New
        </Button>
      </DivAnimated>
      {isNew && (
        <AlbumForm
          onclose={() => setIsNew(false)}
          title={title}
          setTitle={setTitle}
          artistId={artistId}
        />
      )}
    </>
  );
}
