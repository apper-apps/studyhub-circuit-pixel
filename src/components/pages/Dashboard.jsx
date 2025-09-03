import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import UpcomingAssignments from "@/components/organisms/UpcomingAssignments";
import CourseGrid from "@/components/organisms/CourseGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import assignmentService from "@/services/api/assignmentService";
import courseService from "@/services/api/courseService";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [upcomingAssignments, allCourses] = await Promise.all([
        assignmentService.getUpcoming(6),
        courseService.getAll()
      ]);
      
      setAssignments(upcomingAssignments);
      setCourses(allCourses.slice(0, 6)); // Show top 6 courses
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadDashboardData} />;
  }

  // Calculate dashboard stats
  const stats = {
gpa: courses.length > 0 
      ? (courses.reduce((sum, course) => sum + (course.currentGrade / 100 * 4), 0) / courses.length).toFixed(2)
      : "0.00",
    dueThisWeek: assignments.filter(a => {
      const dueDate = new Date(a.dueDate);
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return dueDate <= weekFromNow;
    }).length,
    studyStreak: 12, // Mock data for now
    completionRate: "94%" // Mock data for now
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">StudyHub</span>
          </h1>
          <p className="text-lg text-gray-600">
            Stay organized and achieve your academic goals with smart task management and grade tracking.
          </p>
        </div>
      </motion.div>

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Assignments - 2 columns on large screens */}
        <div className="lg:col-span-2">
          <UpcomingAssignments assignments={assignments} />
        </div>

        {/* Quick Course Overview - 1 column on large screens */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Course Overview</h2>
            <div className="space-y-4">
              {courses.slice(0, 4).map((course, index) => (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-500">{course.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">{course.currentGrade}%</p>
                      <p className="text-xs text-gray-500">{course.credits} credits</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;