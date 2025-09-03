import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";

const CourseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [courseData, assignmentData] = await Promise.all([
        courseService.getById(id),
        assignmentService.getAll()
      ]);
      
      setCourse(courseData);
      // Filter assignments for this course
      setAssignments(assignmentData.filter(assignment => assignment.courseId === parseInt(id)));
    } catch (err) {
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/courses/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      setDeleting(true);
      await courseService.delete(id);
      toast.success("Course deleted successfully!");
      navigate("/courses");
    } catch (err) {
      toast.error(err.message || "Failed to delete course");
    } finally {
      setDeleting(false);
    }
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "warning";
    if (grade >= 70) return "secondary";
    return "error";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "secondary";
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadCourseData} />;
  }

  if (!course) {
    return <Error error="Course not found" onRetry={() => navigate("/courses")} />;
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToCourses}
            className="flex-shrink-0"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: course.color }}
              />
              <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
            </div>
            <p className="text-gray-600 font-medium">{course.code} • {course.credits} Credits • {course.term}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
            ) : (
              <ApperIcon name="Trash2" className="h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </motion.div>

      {/* Course Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="BookOpen" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Grade</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{course.currentGrade}%</p>
                  <Badge variant={getGradeColor(course.currentGrade)}>
                    {course.currentGrade >= 90 ? 'A' : 
                     course.currentGrade >= 80 ? 'B' : 
                     course.currentGrade >= 70 ? 'C' : 
                     course.currentGrade >= 60 ? 'D' : 'F'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-success to-emerald-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="ClipboardList" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-warning to-orange-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Credits</p>
                <p className="text-2xl font-bold text-gray-900">{course.credits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round((course.currentGrade / 100) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Info" className="h-5 w-5" />
                Course Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.instructor && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Instructor:</span>
                  <span className="text-gray-900">{course.instructor}</span>
                </div>
              )}
              {course.location && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Location:</span>
                  <span className="text-gray-900">{course.location}</span>
                </div>
              )}
              {course.schedule && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Schedule:</span>
                  <span className="text-gray-900">{course.schedule}</span>
                </div>
              )}
              {course.description && (
                <div>
                  <span className="font-medium text-gray-600 block mb-2">Description:</span>
                  <p className="text-gray-900">{course.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ApperIcon name="ClipboardList" className="h-5 w-5" />
                  Assignments ({assignments.length})
                </h2>
                <Button
                  size="sm"
                  onClick={() => navigate("/assignments")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.slice(0, 5).map((assignment) => (
                    <div
                      key={assignment.Id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                        {assignment.status === "Completed" && (
                          <Badge variant="success">Completed</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {assignments.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      And {assignments.length - 5} more assignments...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="ClipboardList" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No assignments found for this course</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Grade Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="BarChart" className="h-5 w-5" />
                Grade Categories
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.gradeCategories && course.gradeCategories.length > 0 ? (
                course.gradeCategories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm font-bold text-gray-900">{category.weight}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${category.weight}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <ApperIcon name="BarChart" className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No grade categories defined</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseDetails;