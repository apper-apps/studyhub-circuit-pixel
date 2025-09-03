import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { path: "/", label: "Dashboard", icon: "Home" },
    { path: "/courses", label: "Courses", icon: "BookOpen" },
    { path: "/assignments", label: "Assignments", icon: "ClipboardList" },
    { path: "/calendar", label: "Calendar", icon: "Calendar" },
    { path: "/grades", label: "Grades", icon: "BarChart3" },
  ];

  const quickAccessCourses = [
    { id: "1", name: "Mathematics", color: "#5B5FDE", code: "MATH101" },
    { id: "2", name: "Physics", color: "#10B981", code: "PHYS201" },
    { id: "3", name: "Chemistry", color: "#F59E0B", code: "CHEM150" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <motion.div
          animate={{ width: isCollapsed ? 80 : 280 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white border-r border-gray-200 shadow-sm flex flex-col"
        >
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
              </div>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      StudyHub
                    </h2>
                    <p className="text-xs text-gray-500">Academic Assistant</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="ml-auto p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon 
                  name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                  className="h-4 w-4 text-gray-500" 
                />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-r-2 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <ApperIcon name={item.icon} className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </nav>

          {/* Quick Access Courses */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 border-t border-gray-100"
              >
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Quick Access
                </h3>
                <div className="space-y-2">
                  {quickAccessCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {course.name}
                        </p>
                        <p className="text-xs text-gray-500">{course.code}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;