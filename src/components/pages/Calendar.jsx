import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isSameMonth } from "date-fns";
import assignmentService from "@/services/api/assignmentService";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDayAssignments, setSelectedDayAssignments] = useState([]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await assignmentService.getAll();
      setAssignments(data);
      
      // Load assignments for initially selected date
      const dayAssignments = data.filter(assignment => 
        isSameDay(new Date(assignment.dueDate), selectedDate)
      );
      setSelectedDayAssignments(dayAssignments);
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    // Update selected day assignments when date changes
    const dayAssignments = assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), selectedDate)
    );
    setSelectedDayAssignments(dayAssignments);
  }, [selectedDate, assignments]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get assignments for a specific day
  const getAssignmentsForDay = (day) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), day)
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-error";
      case "medium": return "bg-warning";
      case "low": return "bg-success";
      default: return "bg-primary";
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadAssignments} />;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
          <p className="text-gray-600">
            View all your assignment deadlines and important dates in one place.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar - 3 columns */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  {format(currentDate, "MMMM yyyy")}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth(-1)}
                  >
                    <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setCurrentDate(new Date());
                      setSelectedDate(new Date());
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateMonth(1)}
                  >
                    <ApperIcon name="ChevronRight" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 border-t border-gray-200">
                {/* Day Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 border-b border-r border-gray-200">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {calendarDays.map((day, index) => {
                  const dayAssignments = getAssignmentsForDay(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <motion.div
                      key={day.toISOString()}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[120px] p-2 border-b border-r border-gray-200 cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-primary/10 border-primary" 
                          : isToday(day)
                          ? "bg-accent/10"
                          : "hover:bg-gray-50"
                      } ${!isCurrentMonth ? "text-gray-400 bg-gray-50/50" : ""}`}
                    >
                      <div className={`text-sm font-semibold mb-1 ${
                        isToday(day) ? "text-accent" : isSelected ? "text-primary" : "text-gray-900"
                      }`}>
                        {format(day, "d")}
                      </div>
                      
                      <div className="space-y-1">
                        {dayAssignments.slice(0, 3).map((assignment) => (
                          <div
                            key={assignment.Id}
                            className="text-xs p-1 rounded truncate"
                            style={{ backgroundColor: assignment.courseColor + "20", color: assignment.courseColor }}
                          >
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getPriorityColor(assignment.priority)}`}
                              />
                              <span className="truncate font-medium">
                                {assignment.title}
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        {dayAssignments.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayAssignments.length - 3} more
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Day Details - 1 column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="h-5 w-5 text-primary" />
                {format(selectedDate, "EEEE, MMMM d")}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {selectedDayAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="CalendarCheck" className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments</h3>
                  <p className="text-gray-600 text-sm">
                    {isToday(selectedDate) 
                      ? "You're all caught up for today!"
                      : "No assignments due on this day."
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    {selectedDayAssignments.length} assignment{selectedDayAssignments.length !== 1 ? "s" : ""} due
                  </h3>
                  
                  {selectedDayAssignments.map((assignment) => (
                    <motion.div
                      key={assignment.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                          style={{ backgroundColor: assignment.courseColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {assignment.title}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-600">
                              {assignment.courseName}
                            </span>
                            <Badge variant={
                              assignment.priority === "high" ? "error" :
                              assignment.priority === "medium" ? "warning" : "success"
                            } className="text-xs">
                              {assignment.priority}
                            </Badge>
                          </div>
                          {assignment.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {assignment.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Due {format(new Date(assignment.dueDate), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total assignments</span>
                  <span className="font-semibold">
                    {assignments.filter(a => isSameMonth(new Date(a.dueDate), currentDate)).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-success">
                    {assignments.filter(a => 
                      a.completed && isSameMonth(new Date(a.dueDate), currentDate)
                    ).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High priority</span>
                  <span className="font-semibold text-error">
                    {assignments.filter(a => 
                      a.priority === "high" && isSameMonth(new Date(a.dueDate), currentDate)
                    ).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;