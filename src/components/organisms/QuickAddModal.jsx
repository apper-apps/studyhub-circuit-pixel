import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import PrioritySelect from "@/components/molecules/PrioritySelect";
import ApperIcon from "@/components/ApperIcon";

const QuickAddModal = ({ isOpen, onClose, courses = [], onAddAssignment }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    dueTime: "",
    priority: "medium",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Please enter an assignment title");
      return;
    }
    
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }
    
    if (!formData.dueDate) {
      toast.error("Please select a due date");
      return;
    }

    setIsSubmitting(true);

    try {
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime || "23:59"}`);
      
      const newAssignment = {
        title: formData.title.trim(),
        courseId: formData.courseId,
        dueDate: dueDateTime.toISOString(),
        priority: formData.priority,
        description: formData.description.trim(),
        completed: false,
      };

      await onAddAssignment?.(newAssignment);
      
      toast.success("Assignment added successfully!");
      
      // Reset form
      setFormData({
        title: "",
        courseId: "",
        dueDate: "",
        dueTime: "",
        priority: "medium",
        description: "",
      });
      
      onClose();
    } catch (error) {
      toast.error("Failed to add assignment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Smart parsing for natural language input
  const handleTitleChange = (value) => {
    setFormData(prev => ({ ...prev, title: value }));
    
    // Simple natural language parsing
    const input = value.toLowerCase();
    
    // Extract course hints
    courses.forEach(course => {
      if (input.includes(course.name.toLowerCase()) || input.includes(course.code.toLowerCase())) {
        setFormData(prev => ({ ...prev, courseId: course.Id }));
      }
    });
    
    // Extract priority hints
    if (input.includes("urgent") || input.includes("important")) {
      setFormData(prev => ({ ...prev, priority: "high" }));
    } else if (input.includes("easy") || input.includes("simple")) {
      setFormData(prev => ({ ...prev, priority: "low" }));
    }
    
    // Extract due date hints
    const today = new Date();
    if (input.includes("today")) {
      setFormData(prev => ({ ...prev, dueDate: today.toISOString().split("T")[0] }));
    } else if (input.includes("tomorrow")) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({ ...prev, dueDate: tomorrow.toISOString().split("T")[0] }));
    } else if (input.includes("friday")) {
      const friday = new Date(today);
      friday.setDate(today.getDate() + (5 - today.getDay()));
      setFormData(prev => ({ ...prev, dueDate: friday.toISOString().split("T")[0] }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Quick Add Assignment
                  </h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <ApperIcon name="X" className="h-5 w-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField
                    label="Assignment Title"
                    placeholder="e.g., Math homework due Friday"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />

                  <FormField label="Course" required>
                    <select
                      value={formData.courseId}
                      onChange={(e) => handleInputChange("courseId", e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.Id} value={course.Id}>
                          {course.name} ({course.code})
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Due Date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                      required
                    />
                    <FormField
                      label="Due Time"
                      type="time"
                      value={formData.dueTime}
                      onChange={(e) => handleInputChange("dueTime", e.target.value)}
                    />
                  </div>

                  <PrioritySelect
                    value={formData.priority}
                    onChange={(value) => handleInputChange("priority", value)}
                  />

                  <FormField
                    label="Description (Optional)"
                    placeholder="Additional notes about this assignment..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  >
                    <textarea
                      rows={3}
                      placeholder="Additional notes about this assignment..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none"
                    />
                  </FormField>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Plus" className="h-4 w-4" />
                          Add Assignment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;