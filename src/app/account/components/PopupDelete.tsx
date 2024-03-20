import Button from "@/app/components/ui/buttons/Button";

type PropsType = {
  name: string;
  confirm: () => void;
  cancel: () => void;
  isLoading?: boolean;
};

export default function PopupDelete({
  cancel,
  confirm,
  name,
  isLoading,
}: PropsType) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full backdrop-brightness-50 z-40 flex justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col font-kanit bg-black-600 z-40 mt-auto p-4 px-10 text-center gap-6">
        <div className="flex flex-col gap-2">
          <span className=" text-xl">
            Are you sure you want to delete {name}
          </span>
          <span className="text-orange-300">
            We won't be able to get it back
          </span>
        </div>
        <span
          className="grid grid-cols-2 gap-3 
        self-center"
        >
          <Button
            disabled={isLoading}
            className="rounded-lg bg-white text-black"
            onClick={cancel}
          >
            Cancel
          </Button>
          <Button
            onClick={confirm}
            disabled={isLoading}
            className="rounded-lg bg-orange-500"
          >
            Confirm
          </Button>
        </span>
      </div>
    </div>
  );
}
