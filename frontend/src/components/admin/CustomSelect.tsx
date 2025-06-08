import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  icon,
  className,
  disabled = false,
}: CustomSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={`w-full gap-1 ${className}`}>
        {icon && icon}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="dark:bg-card dark:border-border dark:text-card-foreground">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="dark:focus:bg-accent dark:focus:text-accent-foreground dark:data-[state=checked]:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default CustomSelect;
