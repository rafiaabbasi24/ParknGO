import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

interface ExportButtonProps {
  type: 'csv' | 'pdf';
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  type, 
  onClick, 
  disabled = false,
  icon
}) => {
  const getButtonProps = () => {
    switch(type) {
      case 'csv':
        return {
          className: "bg-emerald-600 hover:bg-emerald-700 text-white gap-2",
          icon: icon || <FileSpreadsheet className="w-4 h-4 mr-2" />,
          text: "Export CSV"
        };
      case 'pdf':
        return {
          className: "bg-blue-600 hover:bg-blue-700 text-white gap-2",
          icon: icon || <Download className="w-4 h-4 mr-2" />,
          text: "Export PDF"
        };
      default:
        return {
          className: "",
          icon: <Download className="w-4 h-4 mr-2" />,
          text: "Export"
        };
    }
  };

  const { className, icon: buttonIcon, text } = getButtonProps();

  return (
    <Tooltip>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`shadow-sm font-medium ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {buttonIcon}
        {text}
      </Button>
    </Tooltip>
  );
};
