import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "skeleton") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="shimmer h-6 bg-gray-200 rounded mb-4"></div>
              <div className="shimmer h-8 bg-gray-200 rounded-lg mb-2"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="shimmer h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="shimmer h-3 w-3 bg-gray-200 rounded-full"></div>
                  <div className="shimmer h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="shimmer h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"
      />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Loading StudyHub</h3>
        <p className="text-sm text-gray-500">Getting your academic data ready...</p>
      </div>
    </div>
  );
};

export default Loading;