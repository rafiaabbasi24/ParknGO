import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileDown, RefreshCw, Download } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ExportActionsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  onRefresh: () => void;
  disabled?: boolean;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  onExportCSV,
  onExportPDF,
  onRefresh,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Mobile View - Dropdown */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              disabled={disabled}
              className="border-blue-100 dark:border-blue-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={onExportCSV}
              disabled={disabled}
              className="cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" />
              <span>Export as CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onExportPDF}
              disabled={disabled}
              className="cursor-pointer"
            >
              <FileDown className="h-4 w-4 mr-2 text-blue-500" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onRefresh}
              className="cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh Data</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tablet/Desktop View - Separate Buttons */}
      <div className="hidden sm:flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outline"
                  onClick={onRefresh}
                  className="border-blue-100 dark:border-blue-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span>Refresh</span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh booking data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={onExportCSV}
                  disabled={disabled}
                  variant="outline"
                  className="border-emerald-100 dark:border-emerald-800/30 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <span>CSV</span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export as CSV spreadsheet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={onExportPDF}
                  disabled={disabled}
                  variant="outline"
                  className="border-blue-100 dark:border-blue-800/30 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  <span>PDF</span>
                </Button>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export as PDF document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
