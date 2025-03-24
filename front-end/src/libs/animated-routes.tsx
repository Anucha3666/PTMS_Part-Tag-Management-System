import { motion, AnimatePresence } from "framer-motion";
import { FC, ReactNode } from "react";
import { useAppSelector } from "@/store/hook";

export const AnimatedRoutes: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLeft } = useAppSelector((state) => state.utils);

  return (
    <AnimatePresence mode='wait'>
      {isLeft ? (
        <motion.div
          key={location.pathname}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          // exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.5 }}
          className=' w-full h-full overflow-hidden'>
          {children}
        </motion.div>
      ) : (
        <motion.div
          key={location.pathname}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          // exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.5 }}
          className=' w-full h-full overflow-hidden'>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
