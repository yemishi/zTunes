import AlbumForm from "./albumForm/AlbumForm";
import { Button, Input, DivAnimated } from "@/ui";

import { useState } from "react";
import { Modal } from "@/components";

export default function CreateAlbum({ artistId }: { artistId: string }) {
  const [title, setTitle] = useState<string>("");
  const [isNewAlbum, setIsNewAlbum] = useState(false);
  return (
    <>
      <DivAnimated oneSide onClick={(e) => e.stopPropagation()} className="flex items-center px-2">
        {isNewAlbum && (
          <Modal className="modal-container" onClose={() => setIsNewAlbum(false)}>
            <AlbumForm artistId={artistId} onClose={() => setIsNewAlbum(false)} title={title} />
          </Modal>
        )}
        <Input label="New album name" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={() => setIsNewAlbum(true)} className="ml-auto rounded-lg text-sm text-black">
          New
        </Button>
      </DivAnimated>
    </>
  );
}
