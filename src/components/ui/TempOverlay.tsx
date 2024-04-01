"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useTempOverlay } from "@/context/Provider";

export default function TempOverlay() {
  const { children } = useTempOverlay();

  return (
    <AnimatePresence>
      {children && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 h-full w-full pb-16 z-20 backdrop-brightness-75 backdrop-blur-sm flex items-center justify-center overflow-auto"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
