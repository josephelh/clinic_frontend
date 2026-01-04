import { motion } from "framer-motion";

interface LoaderProps {
  variant?: "default" | "white" | "brand";
  size?: "sm" | "md" | "lg";
}

const Loader = ({ variant = "brand", size = "md" }: LoaderProps) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  const colorClasses = {
    default: "border-gray-200 border-t-navy-700",
    white: "border-white/30 border-t-white",
    brand: "border-brand-100 border-t-brand-500", // Using Horizon UI brand colors
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={`rounded-full ${sizeClasses[size]} ${colorClasses[variant]}`}
      />
    </div>
  );
};

export default Loader;