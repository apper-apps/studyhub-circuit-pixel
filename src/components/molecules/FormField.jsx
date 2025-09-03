import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ label, error, className, children, required, ...props }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className={cn("block", required && "after:content-['*'] after:ml-0.5 after:text-error")}>
          {label}
        </Label>
      )}
      {children || <Input {...props} />}
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;