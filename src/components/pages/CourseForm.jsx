import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import CourseColorPicker from "@/components/molecules/CourseColorPicker";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";

const CourseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: 3,
    term: "Fall 2024",
    color: "#5B5FDE",
    instructor: "",
    location: "",
    schedule: "",
    description: "",
    gradeCategories: [
      { name: "Assignments", weight: 40 },
      { name: "Exams", weight: 30 },
      { name: "Participation", weight: 20 },
      { name: "Project", weight: 10 }
    ]
  });

  const [errors, setErrors] = useState({});

  // Load course data if editing
  useEffect(() => {
    if (isEditing) {
      loadCourse();
    }
  }, [id, isEditing]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError("");
      
      const course = await courseService.getById(id);
      setFormData({
        name: course.name || "",
        code: course.code || "",
        credits: course.credits || 3,
        term: course.term || "Fall 2024",
        color: course.color || "#5B5FDE",
        instructor: course.instructor || "",
        location: course.location || "",
        schedule: course.schedule || "",
        description: course.description || "",
        gradeCategories: course.gradeCategories || [
          { name: "Assignments", weight: 40 },
          { name: "Exams", weight: 30 },
          { name: "Participation", weight: 20 },
          { name: "Project", weight: 10 }
        ]
      });
    } catch (err) {
      setError(err.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Course name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Course code is required";
    }

    if (!formData.credits || formData.credits < 1 || formData.credits > 8) {
      newErrors.credits = "Credits must be between 1 and 8";
    }

    // Validate grade categories total weight
    const totalWeight = formData.gradeCategories.reduce((sum, cat) => sum + (cat.weight || 0), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      newErrors.gradeCategories = "Grade category weights must total 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleGradeCategoryChange = (index, field, value) => {
    const newCategories = [...formData.gradeCategories];
    newCategories[index] = {
      ...newCategories[index],
      [field]: field === 'weight' ? parseFloat(value) || 0 : value
    };
    
    setFormData(prev => ({
      ...prev,
      gradeCategories: newCategories
    }));
  };

  const addGradeCategory = () => {
    setFormData(prev => ({
      ...prev,
      gradeCategories: [
        ...prev.gradeCategories,
        { name: "", weight: 0 }
      ]
    }));
  };

  const removeGradeCategory = (index) => {
    if (formData.gradeCategories.length > 1) {
      setFormData(prev => ({
        ...prev,
        gradeCategories: prev.gradeCategories.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      setSaving(true);
      
      if (isEditing) {
        await courseService.update(id, formData);
        toast.success("Course updated successfully!");
      } else {
        await courseService.create(formData);
        toast.success("Course added successfully!");
      }
      
      navigate("/courses");
    } catch (err) {
      toast.error(err.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/courses");
  };

  if (loading) {
    return <Loading type="skeleton" />;
  }

  if (error) {
    return <Error error={error} onRetry={loadCourse} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="flex-shrink-0"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Course" : "Add New Course"}
          </h1>
          <p className="text-gray-600">
            {isEditing ? "Update course information" : "Fill in the course details below"}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="BookOpen" className="h-5 w-5" />
                Basic Information
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Course Name"
                  error={errors.name}
                  required
                >
                  <Input
                    placeholder="e.g. Introduction to Computer Science"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-error" : ""}
                  />
                </FormField>

                <FormField
                  label="Course Code"
                  error={errors.code}
                  required
                >
                  <Input
                    placeholder="e.g. CS101"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    className={errors.code ? "border-error" : ""}
                  />
                </FormField>

                <FormField
                  label="Credits"
                  error={errors.credits}
                  required
                >
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.credits}
                    onChange={(e) => handleInputChange("credits", parseInt(e.target.value))}
                    className={errors.credits ? "border-error" : ""}
                  />
                </FormField>

                <FormField
                  label="Term"
                  required
                >
                  <select
                    value={formData.term}
                    onChange={(e) => handleInputChange("term", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Fall 2024">Fall 2024</option>
                    <option value="Spring 2025">Spring 2025</option>
                    <option value="Summer 2024">Summer 2024</option>
                    <option value="Winter 2024">Winter 2024</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Course Color">
                <CourseColorPicker
                  value={formData.color}
                  onChange={(color) => handleInputChange("color", color)}
                />
              </FormField>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Info" className="h-5 w-5" />
                Additional Details
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Instructor">
                  <Input
                    placeholder="e.g. Dr. Smith"
                    value={formData.instructor}
                    onChange={(e) => handleInputChange("instructor", e.target.value)}
                  />
                </FormField>

                <FormField label="Location">
                  <Input
                    placeholder="e.g. Room 101, Science Building"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Schedule">
                <Input
                  placeholder="e.g. Mon, Wed, Fri 10:00 AM - 11:00 AM"
                  value={formData.schedule}
                  onChange={(e) => handleInputChange("schedule", e.target.value)}
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  rows="3"
                  placeholder="Brief description of the course..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </FormField>
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
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ApperIcon name="BarChart" className="h-5 w-5" />
                  Grade Categories
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGradeCategory}
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
              {errors.gradeCategories && (
                <p className="text-sm text-error">{errors.gradeCategories}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.gradeCategories.map((category, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Category Name</Label>
                    <Input
                      placeholder="e.g. Assignments"
                      value={category.name}
                      onChange={(e) => handleGradeCategoryChange(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Label>Weight (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={category.weight}
                      onChange={(e) => handleGradeCategoryChange(index, "weight", e.target.value)}
                    />
                  </div>
                  {formData.gradeCategories.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeGradeCategory(index)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Total Weight:</span>
                  <span className={`font-bold ${
                    Math.abs(formData.gradeCategories.reduce((sum, cat) => sum + (cat.weight || 0), 0) - 100) > 0.01 
                      ? 'text-error' 
                      : 'text-success'
                  }`}>
                    {formData.gradeCategories.reduce((sum, cat) => sum + (cat.weight || 0), 0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 justify-end"
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name={isEditing ? "Save" : "Plus"} className="h-4 w-4" />
                {isEditing ? "Update Course" : "Create Course"}
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
};

export default CourseForm;