import { toast } from "react-toastify";
import Button from "@/ui/buttons/Button";
import { motion } from "framer-motion";

type PropsType = {
  forcePush: {
    playlistId: string;
    username: string;
    songSelected: string;
  };
  onclose: () => void;
  goBack: () => void;
};

export default function ForceAddToPlaylist({ forcePush, onclose, goBack }: PropsType) {
  const { playlistId, songSelected, username } = forcePush;

  const fetchData = async () => {
    const body = { id: playlistId, username, songSelected, force: true };
    const data = await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (data.error) return toast.error(data.message);
    toast.success(data.message);
    onclose();
  };

  return (
    <div className="fixed h-full w-full justify-end md:justify-center font-kanit top-0 left-0 text-black backdrop-brightness-50  flex flex-col z-20">
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="flex flex-col bg-black-450 p-4 md:p-9 md:border md:rounded-lg max-w-[650px] self-center text-center gap-6"
      >
        <p className="text-xl font-medium md:px-11 md:text-2xl text-white">This playlist already have this song</p>
        <div className="gap-3 grid grid-cols-2">
          <Button className="bg-white" onClick={fetchData}>
            Add anyway
          </Button>
          <Button onClick={goBack} className="bg-black text-white">
            Go back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
