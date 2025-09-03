import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import assignmentService from "@/services/api/assignmentService";
import courseService from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import AssignmentList from "@/components/organisms/AssignmentList";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";

const Assignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      
      // Assignments now come with course info from database
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/assignments/${assignmentId}`);
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      await assignmentService.toggleComplete(assignmentId);
      
      setAssignments(prev => prev.map(assignment => 
        assignment.Id === assignmentId
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      ));
      
      toast.success("Assignment status updated!");
    } catch (err) {
      toast.error("Failed to update assignment status");
    }
  };

const handleAddAssignment = async (assignmentData) => {
    try {
      // Find course info
      const course = courses.find(c => c.Id === parseInt(assignmentData.courseId));

      const enhancedData = {
        ...assignmentData,
        courseName: course?.name || "Unknown Course",
        courseColor: course?.color || "#5B5FDE"
      };

      await assignmentService.create(enhancedData);
      toast.success("Assignment added successfully!");
      loadData(); // Reload data to show new assignment
    } catch (error) {
      toast.error("Failed to add assignment");
    }
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadData} />;
  }

  if (assignments.length === 0) {
    return (
      <Empty
        icon="ClipboardList"
        title="No assignments yet"
        description="Add your first assignment to start tracking your academic tasks and deadlines."
        actionLabel="Add Assignment"
        onAction={() => setShowQuickAdd(true)}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-gray-600">
            Track and manage your assignment deadlines across all courses.
          </p>
        </div>
        
        <Button 
          onClick={() => setShowQuickAdd(true)}
          className="shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Assignment
        </Button>
      </motion.div>

      {/* Assignment Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="ClipboardList" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-orange-100/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-warning to-orange-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => !a.completed).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-emerald-100/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-success to-emerald-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.completed).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-error/10 to-red-100/10 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-error to-red-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => !a.completed && new Date(a.dueDate) < new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Assignment List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AssignmentList 
          assignments={assignments}
          onAssignmentClick={handleAssignmentClick}
          onToggleComplete={handleToggleComplete}
        />
      </motion.div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        courses={courses}
        onAddAssignment={handleAddAssignment}
      />
    </div>
  );
};

export default Assignments;