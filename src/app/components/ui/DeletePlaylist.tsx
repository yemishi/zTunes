import { ErrorType } from "@/types/response";
import Button from "./buttons/Button";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DeletePlaylist({
  close,
  playlistId,
  playlistName,
}: {
  close: () => void;
  playlistId: string;
  playlistName: string;
}) {
  const { refresh, back } = useRouter();
  const deletePlaylist = async () => {
    const response: ErrorType = await fetch(`/api/playlist`, {
      method: "DELETE",
      body: JSON.stringify({ playlistId }),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message);
    close(), back(), refresh();
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed h-full backdrop-brightness-50 top-0 left-0 z-10 w-full flex justify-center items-center "
    >
      <div className="flex flex-col gap-2 p-4 bg-gray-200 w-[370px] font-kanit text-black rounded-lg">
        <span className="text-xl font-medium">Delete Playlist</span>
        <span className="pr-9 text-sm font-light">
          Do you really want to remove <b>{playlistName}</b> from your library?
        </span>

        <div className="mt-4">
          <Button className="bg-transparent" onClick={close}>
            Cancel
          </Button>
          <Button onClick={deletePlaylist}>Delete</Button>
        </div>
      </div>
    </motion.div>
  );
}
