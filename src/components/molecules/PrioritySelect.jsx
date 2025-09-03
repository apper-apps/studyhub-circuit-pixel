import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const PrioritySelect = ({ value, onChange, className }) => {
  const priorities = [
    { value: "low", label: "Low", color: "text-success", bg: "bg-success/10", icon: "ArrowDown" },
    { value: "medium", label: "Medium", color: "text-warning", bg: "bg-warning/10", icon: "Minus" },
    { value: "high", label: "High", color: "text-error", bg: "bg-error/10", icon: "ArrowUp" },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-gray-700">Priority Level</label>
      <div className="grid grid-cols-3 gap-2">
        {priorities.map((priority) => (
          <button
            key={priority.value}
            type="button"
            onClick={() => onChange(priority.value)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105",
              value === priority.value
                ? "border-current bg-current/5"
                : "border-gray-200 hover:border-gray-300",
              priority.color
            )}
          >
            <ApperIcon name={priority.icon} className="h-4 w-4" />
            <span className="text-xs font-medium">{priority.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelect;