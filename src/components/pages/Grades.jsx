import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GradeTracker from "@/components/organisms/GradeTracker";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadGrades} />;
  }

  if (courses.length === 0) {
    return (
      <Empty
        icon="BarChart3"
        title="No grades to display"
        description="Add courses and assignments to start tracking your academic performance and GPA."
        actionLabel="Add Courses"
        onAction={() => {/* Navigate to courses */}}
      />
    );
  }

  const calculateOverallGPA = () => {
    if (courses.length === 0) return 0;
    
    const totalPoints = courses.reduce((sum, course) => {
      // Convert percentage to 4.0 scale (simplified conversion)
      const gradePoints = Math.max(0, (course.currentGrade - 50) / 10);
      return sum + (gradePoints * course.credits);
    }, 0);
    
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const averageGrade = courses.length > 0 
    ? Math.round(courses.reduce((sum, course) => sum + course.currentGrade, 0) / courses.length)
    : 0;

  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  const highestGrade = Math.max(...courses.map(c => c.currentGrade), 0);
  const lowestGrade = Math.min(...courses.map(c => c.currentGrade), 100);

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Grade Analytics</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your academic performance across all courses and monitor your GPA progress throughout the semester.
        </p>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {calculateOverallGPA()}
          </h3>
          <p className="text-sm font-medium text-gray-600">Current GPA</p>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-emerald-100/10 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-success to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="BarChart3" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-success">
            {averageGrade}%
          </h3>
          <p className="text-sm font-medium text-gray-600">Average Grade</p>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-orange-100/10 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-warning to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="BookOpen" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-warning">
            {totalCredits}
          </h3>
          <p className="text-sm font-medium text-gray-600">Total Credits</p>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-purple-100/10 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Award" className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-secondary">
            {highestGrade}%
          </h3>
          <p className="text-sm font-medium text-gray-600">Highest Grade</p>
        </div>
      </motion.div>

      {/* Grade Tracker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <GradeTracker courses={courses} />
      </motion.div>

      {/* Additional Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="PieChart" className="h-5 w-5 text-primary" />
            Grade Distribution
          </h3>
          <div className="space-y-3">
            {["A (90-100%)", "B (80-89%)", "C (70-79%)", "D (60-69%)", "F (0-59%)"].map((grade, index) => {
              const ranges = [
                courses.filter(c => c.currentGrade >= 90).length,
                courses.filter(c => c.currentGrade >= 80 && c.currentGrade < 90).length,
                courses.filter(c => c.currentGrade >= 70 && c.currentGrade < 80).length,
                courses.filter(c => c.currentGrade >= 60 && c.currentGrade < 70).length,
                courses.filter(c => c.currentGrade < 60).length
              ];
              
              const count = ranges[index];
              const percentage = courses.length > 0 ? (count / courses.length) * 100 : 0;
              
              return (
                <div key={grade} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{grade}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Lightbulb" className="h-5 w-5 text-accent" />
            Performance Insights
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-success/10 to-emerald-100/10 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="TrendingUp" className="h-5 w-5 text-success" />
                <div>
                  <p className="font-semibold text-success">Strong Performance</p>
                  <p className="text-sm text-gray-600">
                    Your average grade of {averageGrade}% shows excellent academic progress.
                  </p>
                </div>
              </div>
            </div>
            
            {lowestGrade < 75 && (
              <div className="p-4 bg-gradient-to-r from-warning/10 to-orange-100/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <ApperIcon name="AlertTriangle" className="h-5 w-5 text-warning" />
                  <div>
                    <p className="font-semibold text-warning">Focus Needed</p>
                    <p className="text-sm text-gray-600">
                      One course has a grade below 75%. Consider additional study time.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <div className="flex items-center gap-3">
                <ApperIcon name="Target" className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-primary">GPA Goal</p>
                  <p className="text-sm text-gray-600">
                    You're on track to maintain a strong GPA of {calculateOverallGPA()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Grades;