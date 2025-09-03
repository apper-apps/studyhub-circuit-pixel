import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ error = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-6"
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 0.5, 
          repeat: 2,
          delay: 0.2
        }}
        className="w-16 h-16 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-white" />
      </motion.div>
      
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-bold text-gray-900">Oops! Something went wrong</h3>
        <p className="text-gray-600 leading-relaxed">{error}</p>
        
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            Try Again
          </motion.button>
        )}
        
        <p className="text-xs text-gray-400 mt-4">
          If this problem persists, please check your internet connection.
        </p>
      </div>
    </motion.div>
  );
};

export default Error;