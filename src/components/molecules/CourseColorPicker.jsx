import { cn } from "@/utils/cn";

const CourseColorPicker = ({ selectedColor, onColorChange, className }) => {
  const colors = [
    "#5B5FDE", // Primary
    "#8B5CF6", // Secondary  
    "#F59E0B", // Accent
    "#EF4444", // Error
    "#10B981", // Success
    "#3B82F6", // Info
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#6366F1", // Indigo
    "#14B8A6", // Teal
    "#F97316", // Orange
    "#84CC16", // Lime
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700">Course Color</label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
              selectedColor === color 
                ? "border-gray-900 ring-2 ring-offset-2 ring-gray-400" 
                : "border-gray-300 hover:border-gray-400"
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseColorPicker;