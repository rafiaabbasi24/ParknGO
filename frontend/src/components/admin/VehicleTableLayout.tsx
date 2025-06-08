import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, Search, AlertCircle, RotateCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface StatusBadgeProps {
  status: "upcoming" | "parked" | "completed" | "due";
  text: string;
  className?: string;
  icon?: ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  className,
  icon,
}) => {
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    parked: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    due: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]} ${className}`}
    >
      {icon}
      {text}
    </div>
  );
};

// Format parking ID to show only first 4 characters followed by ellipsis
export const formatParkingId = (id: string) => {
  if (!id) return "";
  return id.length > 4 ? `${id.substring(0, 4)}...` : id;
};

// ParkingIdDisplay component with tooltip
export const ParkingIdDisplay: React.FC<{ id: string }> = ({ id }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{formatParkingId(id)}</div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-zinc-800 text-white dark:bg-zinc-700 px-3 py-1.5 text-xs"
        >
          <p>{id}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export interface RemarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  remark: string;
  setRemark: (value: string) => void;
  title: string;
  description: string;
  confirmText: ReactNode;
  loading: boolean;
  confirmButtonClassName?: string;
  headerClassName?: string;
  iconClassName?: string;
}

export const RemarkDialog: React.FC<RemarkDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  remark,
  setRemark,
  title,
  description,
  confirmText,
  loading,
  confirmButtonClassName = "",
  headerClassName = "",
  iconClassName = "",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-sm bg-white/95 dark:bg-black/95 border-0 rounded-xl shadow-xl">
        <DialogHeader className={`${headerClassName} -mx-6 -mt-6 p-6 rounded-t-xl`}>
          <div className="flex gap-3 items-center">
            <div
              className={`rounded-full p-2 bg-white/80 dark:bg-zinc-900/80 ${iconClassName}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                <path d="M9 13h6"></path>
                <path d="M12 10v6"></path>
              </svg>
            </div>
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3">
          <label
            htmlFor="remark"
            className="block text-sm font-medium mb-2"
          >
            Remark / Settlement Notes
          </label>
          <Textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter any settlement notes or remarks"
            className="min-h-[120px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-lg"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-zinc-200 dark:border-zinc-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`${confirmButtonClassName}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface VehicleTableLayoutProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  data: any[];
  columns: {
    key: string;
    header: ReactNode;
    cell: (item: any, index: number) => ReactNode;
  }[];
  loading: boolean;
  error: string;
  onSearch: (query: string) => void;
  searchQuery: string;
  onRefresh: () => void;
  emptyMessage: string;
  actionComponent?: ReactNode;
  themeColor?: string;
  cardClassName?: string;
}

export const VehicleTableLayout: React.FC<VehicleTableLayoutProps> = ({
  title,
  subtitle,
  icon,
  data,
  columns,
  loading,
  error,
  onSearch,
  searchQuery,
  onRefresh,
  emptyMessage,
  actionComponent,
  themeColor = "primary",
  cardClassName = "",
}) => {
  // CSS class variables based on theme color for header styling
  const headerClasses = {
    emerald: {
      text: "text-emerald-800 dark:text-emerald-200",
      textMuted: "text-emerald-600/80 dark:text-emerald-400/80",
      bg: "bg-white/80 dark:bg-zinc-900/80",
      border: "border-emerald-100 dark:border-emerald-800/30",
      icon: "text-emerald-600 dark:text-emerald-400",
      searchBg: "bg-white/80 dark:bg-zinc-900/80",
      searchBorder: "border-emerald-100 dark:border-emerald-800/30",
      searchText: "text-emerald-900 dark:text-emerald-100",
      searchPlaceholder:
        "placeholder:text-emerald-400 dark:placeholder:text-emerald-500/70",
      buttonHover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
      buttonText: "text-emerald-700 dark:text-emerald-300",
    },
    amber: {
      text: "text-amber-800 dark:text-amber-200",
      textMuted: "text-amber-600/80 dark:text-amber-400/80",
      bg: "bg-white/80 dark:bg-zinc-900/80",
      border: "border-amber-100 dark:border-amber-800/30",
      icon: "text-amber-600 dark:text-amber-400",
      searchBg: "bg-white/80 dark:bg-zinc-900/80",
      searchBorder: "border-amber-100 dark:border-amber-800/30",
      searchText: "text-amber-900 dark:text-amber-100",
      searchPlaceholder:
        "placeholder:text-amber-400 dark:placeholder:text-amber-500/70",
      buttonHover: "hover:bg-amber-50 dark:hover:bg-amber-900/30",
      buttonText: "text-amber-700 dark:text-amber-300",
    },
    blue: {
      text: "text-blue-800 dark:text-blue-200",
      textMuted: "text-blue-600/80 dark:text-blue-400/80",
      bg: "bg-white/80 dark:bg-zinc-900/80",
      border: "border-blue-100 dark:border-blue-800/30",
      icon: "text-blue-600 dark:text-blue-400",
      searchBg: "bg-white/80 dark:bg-zinc-900/80",
      searchBorder: "border-blue-100 dark:border-blue-800/30",
      searchText: "text-blue-900 dark:text-blue-100",
      searchPlaceholder:
        "placeholder:text-blue-400 dark:placeholder:text-blue-500/70",
      buttonHover: "hover:bg-blue-50 dark:hover:bg-blue-900/30",
      buttonText: "text-blue-700 dark:text-blue-300",
    },
    primary: {
      text: "text-zinc-800 dark:text-zinc-200",
      textMuted: "text-zinc-600/80 dark:text-zinc-400/80",
      bg: "bg-white/80 dark:bg-zinc-900/80",
      border: "border-zinc-100 dark:border-zinc-800/30",
      icon: "text-zinc-600 dark:text-zinc-400",
      searchBg: "bg-white/80 dark:bg-zinc-900/80",
      searchBorder: "border-zinc-100 dark:border-zinc-800/30",
      searchText: "text-zinc-900 dark:text-zinc-100",
      searchPlaceholder:
        "placeholder:text-zinc-400 dark:placeholder:text-zinc-500/70",
      buttonHover: "hover:bg-zinc-50 dark:hover:bg-zinc-800/30",
      buttonText: "text-zinc-700 dark:text-zinc-300",
    },
  };

  // Get the correct theme classes
  const theme =
    headerClasses[themeColor as keyof typeof headerClasses] ||
    headerClasses.primary;

  return (
    <div className="p-6">
      {/* Header with search and filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`mb-6 p-5 rounded-xl ${cardClassName}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${theme.bg} backdrop-blur-md ${theme.icon} ${theme.border}`}
            >
              {icon}
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${theme.text}`}>
                {title}
              </h2>
              <p className={`text-sm ${theme.textMuted}`}>{subtitle}</p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto items-center">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 ${theme.icon}`} />
              </div>
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className={`pl-9 h-10 ${theme.searchBg} ${theme.searchBorder} ${theme.searchText} ${theme.searchPlaceholder} rounded-lg backdrop-blur-md`}
              />
            </div>

            <Button
              onClick={onRefresh}
              size="icon"
              variant="outline"
              className={`h-10 w-10 ${theme.bg} ${theme.buttonHover} ${theme.border} ${theme.buttonText} rounded-lg backdrop-blur-md`}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {actionComponent && <div>{actionComponent}</div>}
          </div>
        </div>
      </motion.div>

      {/* Error display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-700 dark:text-red-400 flex items-center gap-2"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden"
      >
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div
              className={`animate-spin h-12 w-12 text-${themeColor}-600 dark:text-${themeColor}-400 mb-4`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400">Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div
              className={`h-16 w-16 flex items-center justify-center rounded-full bg-${themeColor}-50 dark:bg-${themeColor}-950/30 text-${themeColor}-600 dark:text-${themeColor}-400 mb-4`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 19H3" />
                <path d="M18 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
                <path d="m9 11 2 2 4-4" />
              </svg>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 font-medium mb-1">
              {emptyMessage}
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm text-center max-w-md">
              {searchQuery
                ? `No results found for "${searchQuery}". Try adjusting your search.`
                : "Vehicle data will appear here when available."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className={`bg-${themeColor}-50 dark:bg-zinc-700/20`}>
                <TableRow className={`border-b border-${themeColor}-100 dark:border-${themeColor}-900/30`}>
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`text-${themeColor}-800 dark:text-${themeColor}-200 font-medium py-4`}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-${themeColor}-50/30 dark:hover:bg-${themeColor}-900/10 transition-colors`}
                  >
                    {columns.map((column) => (
                      <TableCell key={`${item.id}-${column.key}`} className="py-3">
                        {column.cell(item, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>

      {/* Records count */}
      {!loading && data.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm text-zinc-500 dark:text-zinc-400"
        >
          Showing{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {data.length}
          </span>{" "}
          records
          {searchQuery && (
            <>
              {" "}
              filtered by "
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {searchQuery}
              </span>
              "
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};
