import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "BookOpen",
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-6"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6"
      >
        <ApperIcon name={icon} className="h-10 w-10 text-primary" />
      </motion.div>
      
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            {actionLabel}
          </motion.button>
        )}
        
        <div className="flex items-center justify-center gap-4 mt-8 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <ApperIcon name="Lightbulb" className="h-3 w-3" />
            <span>Pro tip: Start with your current courses</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;