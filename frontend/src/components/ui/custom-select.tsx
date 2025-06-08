import React, { forwardRef } from "react";
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
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(
  ({ options, value, onChange, placeholder, className, disabled, icon }, ref) => {
    return (
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger 
          ref={ref}
          className={`w-full ${className} dark:bg-slate-800 dark:border-slate-700 dark:text-white`}
        >
          {icon && <span className="mr-2">{icon}</span>}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          className="dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
          position="popper"
        >
          <SelectGroup>
            {options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="dark:hover:bg-slate-700 dark:focus:bg-slate-700"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

CustomSelect.displayName = "CustomSelect";
