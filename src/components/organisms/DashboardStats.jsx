import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "Current GPA",
      value: stats?.gpa || "3.85",
      change: "+0.12",
      icon: "TrendingUp",
      gradient: "from-success to-emerald-600",
      bgGradient: "from-success/10 to-emerald-100/10"
    },
    {
      title: "Due This Week", 
      value: stats?.dueThisWeek || "5",
      change: "-2",
      icon: "Clock",
      gradient: "from-warning to-orange-500",
      bgGradient: "from-warning/10 to-orange-100/10"
    },
    {
      title: "Study Streak",
      value: stats?.studyStreak || "12",
      change: "+1",
      icon: "Flame",
      gradient: "from-primary to-secondary",
      bgGradient: "from-primary/10 to-secondary/10"
    },
    {
      title: "Completion Rate",
      value: stats?.completionRate || "94%",
      change: "+3%",
      icon: "Target",
      gradient: "from-secondary to-purple-600",
      bgGradient: "from-secondary/10 to-purple-100/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </h3>
                    <span className={`text-sm font-semibold ${
                      stat.change.startsWith('+') ? 'text-success' : 'text-error'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {/* Decorative gradient overlay */}
              <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 rounded-full`} />
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;