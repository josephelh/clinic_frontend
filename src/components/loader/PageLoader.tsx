import Loader from "./Loader";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md dark:bg-navy-900/80"
    >
      <Loader size="lg" variant="brand" />
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-sm font-medium text-navy-700 dark:text-white"
      >
        Chargement de votre cabinet...
      </motion.p>
    </motion.div>
  );
};

export default PageLoader;