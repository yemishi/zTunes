import Button from "@/ui/buttons/Button";
import Modal from "../Modal";

type PropsType = {
  confirm: () => void;
  onClose: () => void;
  name?: string;
  isLoading?: boolean;
  confirmDesc?: string;
  desc?: string;
};

export default function PopConfirm({ desc, onClose, confirm, name = "this?", isLoading, confirmDesc }: PropsType) {
  return (
    <Modal
      onClose={onClose}
      className="mx-auto my-auto flex flex-col font-kanit bg-gray-300 text-black rounded-xl px-8 py-6 text-center gap-6 shadow-xl max-w-md"
    >
      {desc ? (
        <h2 className="text-2xl font-semibold text-gray-800">{desc}</h2>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Are you sure you want to delete <span className="text-orange-600">{name}</span>?
          </h2>
          <p className="text-sm lg:text-base text-red-500 font-medium">
            This action is permanent and cannot be undone.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Button
          disabled={isLoading}
          onClick={onClose}
          className="rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={confirm}
          className="rounded-lg bg-red-400 text-white hover:bg-red-500 transition"
        >
          {isLoading ? "Deleting..." : confirmDesc || "Confirm"}
        </Button>
      </div>
    </Modal>
  );
}
