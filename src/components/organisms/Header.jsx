import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import { motion } from "framer-motion";

const Header = ({ onAddClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/courses":
        return "My Courses";
      case "/assignments":
        return "Assignments";
      case "/calendar":
        return "Calendar";
      case "/grades":
        return "Grades";
      default:
        return "StudyHub";
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // TODO: Implement search functionality
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm sticky top-0 z-40"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {location.pathname === "/" && "Welcome back! Here's your academic overview"}
                {location.pathname === "/courses" && "Manage your enrolled courses"}
                {location.pathname === "/assignments" && "Track your assignments and deadlines"}
                {location.pathname === "/calendar" && "View your academic calendar"}
                {location.pathname === "/grades" && "Monitor your academic performance"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search assignments, courses..."
              onSearch={handleSearch}
              className="w-64 hidden sm:block"
            />
            
            {onAddClick && (
              <Button
                onClick={onAddClick}
                size="sm"
                variant="accent"
                className="shadow-lg hover:shadow-xl"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Add</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <ApperIcon name="Bell" className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;