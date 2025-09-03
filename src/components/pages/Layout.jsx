import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import assignmentService from "@/services/api/assignmentService";
import courseService from "@/services/api/courseService";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Error from "@/components/ui/Error";

const Layout = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [courses, setCourses] = useState([]);

  const handleQuickAddOpen = async () => {
    try {
      // Load courses for the quick add modal
      const coursesData = await courseService.getAll();
      setCourses(coursesData);
      setShowQuickAdd(true);
    } catch (error) {
      console.error("Failed to load courses:", error);
      setShowQuickAdd(true); // Open anyway with empty courses
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

      const newAssignment = await assignmentService.create(enhancedData);
      toast.success("Assignment added successfully!");
      return newAssignment;
    } catch (error) {
      console.error("Failed to add assignment:", error);
      toast.error("Failed to add assignment");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <Header onAddClick={handleQuickAddOpen} />
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        courses={courses}
        onAddAssignment={handleAddAssignment}
      />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Layout;