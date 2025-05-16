"use client";

import { IoIosArrowBack } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  goBack: () => void;
  step: number;
  desc: string;
  totalSteps: number;
}
export default function ProgressStep({ step, goBack, desc, totalSteps }: Props) {
  const progressWidth = totalSteps === 0 ? 100 : ((step / totalSteps || 0) * 100).toFixed(2);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/60 w-full h-[1px] relative">
        <span style={{ width: `${progressWidth}%` }} className="absolute h-full top-0 bg-orange-500 transition-all" />
      </div>
      <div className="flex flex-col gap-3 min-3xl:my-3">
        <div className="self-start flex gap-2 items-center">
          {totalSteps > 0 && (
            <IoIosArrowBack
              className={`size-7 ${
                step === 0 ? "opacity-70 pointer-events-none" : "hover:text-blue-400 cursor-pointer"
              }`}
              onClick={goBack}
            />
          )}

          <span className="flex flex-col">
            <p className="text-orange">{`Step ${step + 1} of ${totalSteps + 1}`}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={desc}
                className="font-medium text-amber-300"
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {desc}
              </motion.p>
            </AnimatePresence>
          </span>
        </div>
      </div>
    </div>
  );
}
