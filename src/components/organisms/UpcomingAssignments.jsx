import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const UpcomingAssignments = ({ assignments = [] }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high": return "ArrowUp";
      case "medium": return "Minus";
      case "low": return "ArrowDown";
      default: return "Minus";
    }
  };

const handleMarkComplete = async (assignmentId) => {
    try {
      const { toggleComplete } = await import('@/services/api/assignmentService');
      await toggleComplete(assignmentId);
      // Note: Parent component should handle state updates via props
    } catch (error) {
      console.error("Failed to mark assignment as complete:", error);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="Clock" className="h-5 w-5 text-warning" />
            Upcoming Deadlines
          </CardTitle>
          <Button variant="ghost" size="sm">
            <ApperIcon name="ArrowRight" className="h-4 w-4" />
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-emerald-100/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="CheckCircle" className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600 text-sm">No upcoming assignments this week.</p>
          </div>
        ) : (
          assignments.slice(0, 5).map((assignment, index) => (
            <motion.div
              key={assignment.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: assignment.courseColor || "#5B5FDE" }}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {assignment.title}
                  </h4>
                  <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                    <ApperIcon name={getPriorityIcon(assignment.priority)} className="h-3 w-3 mr-1" />
                    {assignment.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{assignment.courseName}</span>
                  <span>Due {format(new Date(assignment.dueDate), "MMM d, h:mm a")}</span>
                </div>
              </div>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleMarkComplete(assignment.Id)}
                className="flex-shrink-0"
              >
                <ApperIcon name="Check" className="h-4 w-4" />
              </Button>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignments;