import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CourseGrid = ({ courses = [], onCourseClick, onEditCourse }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "warning";
    if (grade >= 70) return "secondary";
    return "error";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => onCourseClick?.(course.Id)}
          className="cursor-pointer group"
        >
          <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 group-hover:border-primary/20 overflow-hidden">
            <div 
              className="h-2 w-full"
              style={{ backgroundColor: course.color }}
            />
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">{course.code}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditCourse?.(course.Id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ApperIcon name="MoreVertical" className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Current Grade</span>
                <Badge variant={getGradeColor(course.currentGrade)} className="font-bold">
                  {course.currentGrade}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Credits</span>
                <span className="text-sm font-bold text-gray-900">{course.credits}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Assignments</span>
                <div className="flex items-center gap-1">
                  <ApperIcon name="ClipboardList" className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">{course.assignmentCount || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Term</span>
                <span className="text-sm font-bold text-gray-900">{course.term}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-700 font-medium">{Math.round((course.currentGrade / 100) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${Math.min(course.currentGrade, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default CourseGrid;