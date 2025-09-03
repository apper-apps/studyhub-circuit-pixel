import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const GradeTracker = ({ courses = [] }) => {
  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "warning";
    if (grade >= 70) return "secondary";
    return "error";
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  };

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
    
    const totalPoints = courses.reduce((sum, course) => {
      const gradePoints = Math.max(0, (course.currentGrade - 50) / 10);
      return sum + (gradePoints * course.credits);
    }, 0);
    
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Overall GPA Card */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="TrendingUp" className="h-5 w-5 text-primary" />
            Overall Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {calculateOverallGPA()}
              </h3>
              <p className="text-sm font-medium text-gray-600 mt-1">Cumulative GPA</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900">
                {courses.length}
              </h3>
              <p className="text-sm font-medium text-gray-600 mt-1">Total Courses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Grades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ApperIcon name="BarChart3" className="h-5 w-5 text-primary" />
            Course Breakdown
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="BookOpen" className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses enrolled</h3>
              <p className="text-gray-600 text-sm">Add your courses to start tracking grades.</p>
            </div>
          ) : (
            courses.map((course, index) => (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: course.color }}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">{course.code} • {course.credits} credits</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge variant={getGradeColor(course.currentGrade)} className="font-bold">
                          {getLetterGrade(course.currentGrade)}
                        </Badge>
                        <span className="text-lg font-bold text-gray-900">
                          {course.currentGrade}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r transition-all duration-500 ${
                          course.currentGrade >= 90 ? "from-success to-emerald-600" :
                          course.currentGrade >= 80 ? "from-warning to-orange-500" :
                          course.currentGrade >= 70 ? "from-secondary to-purple-600" :
                          "from-error to-red-600"
                        }`}
                        style={{ width: `${Math.min(course.currentGrade, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Grade Categories */}
                {course.gradeCategories && course.gradeCategories.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {course.gradeCategories.map((category) => (
                      <div key={category.id} className="text-center">
                        <p className="text-xs font-medium text-gray-600">{category.name}</p>
                        <p className="text-sm font-bold text-gray-900">{category.weight}%</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeTracker;