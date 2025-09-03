import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const AssignmentList = ({ assignments = [], onAssignmentClick, onToggleComplete }) => {
  const [filter, setFilter] = useState("all"); // all, pending, completed, overdue

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

const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && !assignments.find(a => a.dueDate === dueDate)?.completed;
  };

  const getStatusBadge = (assignment) => {
    if (assignment.completed) {
      return <Badge variant="success">Completed</Badge>;
    }
    if (isOverdue(assignment.dueDate)) {
      return <Badge variant="error">Overdue</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  const filteredAssignments = assignments.filter(assignment => {
    switch (filter) {
      case "pending":
        return !assignment.completed && !isOverdue(assignment.dueDate);
      case "completed":
        return assignment.completed;
      case "overdue":
        return isOverdue(assignment.dueDate);
      default:
        return true;
    }
  });

  const filters = [
    { value: "all", label: "All", count: assignments.length },
    { value: "pending", label: "Pending", count: assignments.filter(a => !a.completed && !isOverdue(a.dueDate)).length },
    { value: "overdue", label: "Overdue", count: assignments.filter(a => isOverdue(a.dueDate)).length },
    { value: "completed", label: "Completed", count: assignments.filter(a => a.completed).length },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filterOption) => (
              <Button
                key={filterOption.value}
                variant={filter === filterOption.value ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterOption.value)}
                className="flex items-center gap-2"
              >
                {filterOption.label}
                <Badge 
                  variant={filter === filterOption.value ? "outline" : "default"} 
                  className="bg-white text-gray-600 border-gray-300"
                >
                  {filterOption.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignment List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="ClipboardList" className="h-5 w-5 text-primary" />
            Assignments ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="ClipboardCheck" className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-600 text-sm">
                {filter === "all" && "No assignments to show. Add your first assignment!"}
                {filter === "pending" && "All assignments are complete! Great job!"}
                {filter === "overdue" && "No overdue assignments. You're on track!"}
                {filter === "completed" && "No completed assignments yet."}
              </p>
            </div>
          ) : (
            filteredAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                onClick={() => onAssignmentClick?.(assignment.Id)}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer group ${
                  assignment.completed 
                    ? "bg-gray-50 border-gray-200 opacity-75" 
                    : "bg-white border-gray-200 hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete?.(assignment.Id);
                    }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      assignment.completed
                        ? "bg-success border-success"
                        : "border-gray-300 hover:border-primary"
                    }`}
                  >
                    {assignment.completed && (
                      <ApperIcon name="Check" className="h-3 w-3 text-white" />
                    )}
                  </button>
                  
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: assignment.courseColor || "#5B5FDE" }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={`font-semibold truncate group-hover:text-primary transition-colors ${
                        assignment.completed ? "text-gray-500 line-through" : "text-gray-900"
                      }`}>
                        {assignment.title}
                      </h4>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                          <ApperIcon name={getPriorityIcon(assignment.priority)} className="h-3 w-3 mr-1" />
                          {assignment.priority}
                        </Badge>
                        {getStatusBadge(assignment)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="font-medium">{assignment.courseName}</span>
                      <span>Due {format(new Date(assignment.dueDate), "MMM d, h:mm a")}</span>
                      {assignment.grade && (
                        <span className="text-success font-semibold">Grade: {assignment.grade}%</span>
                      )}
                    </div>
                    
                    {assignment.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                  
                  <ApperIcon 
                    name="ChevronRight" 
                    className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" 
                  />
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentList;