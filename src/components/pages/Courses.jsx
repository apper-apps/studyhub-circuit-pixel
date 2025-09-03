import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import CourseGrid from "@/components/organisms/CourseGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await courseService.getCoursesWithStats();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEditCourse = (courseId) => {
    navigate(`/courses/${courseId}/edit`);
  };

  const handleAddCourse = () => {
    navigate("/courses/new");
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadCourses} />;
  }

  if (courses.length === 0) {
    return (
      <Empty
        icon="BookOpen"
        title="No courses enrolled"
        description="Start by adding your current courses to track assignments and grades effectively."
        actionLabel="Add First Course"
        onAction={handleAddCourse}
      />
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">
            Manage your enrolled courses for {new Date().getFullYear()} academic year.
          </p>
        </div>
        
        <Button 
          onClick={handleAddCourse}
          className="shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Course
        </Button>
      </motion.div>

      {/* Course Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-emerald-100/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-success to-emerald-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.length > 0 
                  ? Math.round(courses.reduce((sum, course) => sum + course.currentGrade, 0) / courses.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-orange-100/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-warning to-orange-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.credits, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-purple-100/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ClipboardList" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + (course.assignmentCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CourseGrid 
          courses={courses}
          onCourseClick={handleCourseClick}
          onEditCourse={handleEditCourse}
        />
      </motion.div>
    </div>
  );
};

export default Courses;