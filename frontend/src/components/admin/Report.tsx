import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/utils/backend";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// ShadCN UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  FileText,
  Filter,
  FileSpreadsheet,
  Car,
  Timer,
  ClipboardList,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  UserRound,
  MapPin,
  Tag,
  BarChart3,
  ArrowDownToLine,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

interface BookingItem {
  key: string;
  name: string;
  company: string;
  registrationNumber: string;
  category: string;
  location: string;
  inTime: string;
  outTime?: string;
  totalSpent: string;
}

const Report = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [ongoing, setOngoing] = useState<BookingItem[]>([]);
  const [upcoming, setUpcoming] = useState<BookingItem[]>([]);
  const [past, setPast] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get unique categories for filter
  const categories = [...new Set(bookings.map((b) => b.category))].filter(
    Boolean
  );

  const formatData = (data: any[]) => {
    return data.map((b) => ({
      key: b.bookId,
      name: `${b.user?.firstName || "N/A"} ${b.user?.lastName || ""}`,
      company: b.vehicle?.vehicleCompanyName || "N/A",
      registrationNumber: b.vehicle?.registrationNumber || "N/A",
      category: b.vehicle?.vehicleCategory?.vehicleCat || "N/A",
      location: b.parkingLot?.location || "N/A",
      inTime: b.vehicle?.inTime
        ? new Date(b.vehicle.inTime).toLocaleString()
        : "-",
      outTime: b.vehicle?.outTime
        ? new Date(b.vehicle.outTime).toLocaleString()
        : "-",
      totalSpent: `Rs.${b.parkingLot?.price || 0}`,
    }));
  };

  // Helper function to classify bookings
  useEffect(() => {
    const classifyBookings = () => {
      const now = new Date();
      const upcoming = [];
      const ongoing = [];
      const past = [];

      for (const b of bookings) {
        const inTime = new Date(b.inTime);
        const outTime = b.outTime ? new Date(b.outTime) : null;

        if (inTime > now) {
          upcoming.push(b);
        } else if (outTime && outTime < now) {
          past.push(b);
        } else {
          ongoing.push(b);
        }
      }

      setOngoing(ongoing);
      setPast(past);
      setUpcoming(upcoming);
    };
    classifyBookings();
  }, [bookings]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/admin/generateReport`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("adminToken")}`,
          },
        });
        setBookings(formatData(res.data));
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // Sort function
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  // Filter and sort the data with pagination
  const getFilteredData = (data: BookingItem[]) => {
    let filteredData = [...data];

    // Apply category filter
    if (selectedCategory !== "all") {
      filteredData = filteredData.filter(
        (item) => item.category === selectedCategory
      );
    }

    // Apply sorting
    if (sortConfig) {
      filteredData.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  // Get paginated data
  const getPaginatedData = (data: BookingItem[]) => {
    const filteredData = getFilteredData(data);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return {
      paginatedData: filteredData.slice(startIndex, endIndex),
      totalItems: filteredData.length,
      totalPages: Math.ceil(filteredData.length / itemsPerPage)
    };
  };

  // Export functions
  const exportCSV = () => {
    setExporting(true);
    try {
      const activeData =
        activeTab === "ongoing"
          ? ongoing
          : activeTab === "upcoming"
          ? upcoming
          : past;
      const filteredData = getFilteredData(activeData);

      const csv = Papa.unparse(
        filteredData.map((b) => ({
          "Parking Number": b.key || "N/A",
          Name: b.name || "N/A",
          Company: b.company || "N/A",
          "Reg No": b.registrationNumber || "N/A",
          Category: b.category || "N/A",
          Location: b.location || "N/A",
          "In Time": b.inTime || "-",
          "Out Time": b.outTime || "-",
          "Total Spent": b.totalSpent,
        }))
      );

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
      }_Bookings_${format(new Date(), "yyyy-MM-dd")}.csv`;
      link.click();
      toast.success("CSV file exported successfully");
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const exportPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const dateStr = format(new Date(), "MMM dd, yyyy");

      // Add header with logo and title
      doc.setFillColor(52, 152, 219); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("ParkNGo - Booking Report", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Generated on: ${dateStr}`, 105, 30, { align: "center" });

      const activeData =
        activeTab === "ongoing"
          ? ongoing
          : activeTab === "upcoming"
          ? upcoming
          : past;
      const filteredData = getFilteredData(activeData);

      // Define column headers based on active tab
      const headers = [
        "Parking #",
        "Name",
        "Company",
        "Reg No",
        "Category",
        "Location",
        "In Time",
        ...(activeTab === "past" ? ["Out Time"] : []),
        "Total Spent",
      ];

      // Add section title
      doc.setFontSize(16);
      doc.setTextColor(52, 152, 219);
      doc.text(
        `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Bookings (${
          filteredData.length
        })`,
        14,
        50
      );

      // Generate table
      autoTable(doc, {
        startY: 55,
        head: [headers],
        body: filteredData.map((b) => [
          b.key || "N/A",
          b.name || "N/A",
          b.company || "N/A",
          b.registrationNumber || "N/A",
          b.category || "N/A",
          b.location || "N/A",
          b.inTime || "-",
          ...(activeTab === "past" ? [b.outTime || "-"] : []),
          b.totalSpent,
        ]),
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 55 },
      });

      // Add footer
      const pageCount = doc.internal.pages.length - 1; // Subtract 1 because jsPDF uses 1-indexed pages array
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - ParkNGo Booking Report`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      doc.save(
        `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        }_Bookings_${format(new Date(), "yyyy-MM-dd")}.pdf`
      );
      toast.success("PDF file exported successfully");
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Modernized tab icons with colors that match the tab states
  const tabIcons = {
    ongoing: <Timer className="h-4 w-4 text-teal-600 dark:text-teal-400 group-data-[state=active]:text-white dark:group-data-[state=active]:text-zinc-900" />,
    upcoming: <ClipboardList className="h-4 w-4 text-indigo-600 dark:text-indigo-400 group-data-[state=active]:text-white dark:group-data-[state=active]:text-zinc-900" />,
    past: <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 group-data-[state=active]:text-white dark:group-data-[state=active]:text-zinc-900" />,
  };

  // Function to get appropriate tab background colors
  const getTabStyles = (tabValue: string) => {
    const styles = {
      ongoing: {
        active: "bg-gradient-to-r from-teal-600 to-green-600 dark:from-teal-500 dark:to-green-500 text-white dark:text-zinc-900",
        count: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
        hover: "hover:bg-teal-50 dark:hover:bg-teal-900/20",
      },
      upcoming: {
        active: "bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500 text-white dark:text-zinc-900",
        count: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
        hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
      },
      past: {
        active: "bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-500 dark:to-violet-500 text-white dark:text-zinc-900",
        count: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
        hover: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
      },
    };
    
    return styles[tabValue as keyof typeof styles];
  };

  // Color configuration for active tab based content
  const getActiveTabColors = () => {
    const colors = {
      ongoing: {
        primary: "text-teal-600 dark:text-teal-400",
        bg: "bg-teal-50 dark:bg-teal-900/20",
        border: "border-teal-100 dark:border-teal-900/30",
        accent: "from-teal-600 to-green-600 dark:from-teal-500 dark:to-green-500",
        badge: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800/30",
      },
      upcoming: {
        primary: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        border: "border-indigo-100 dark:border-indigo-900/30",
        accent: "from-indigo-600 to-blue-600 dark:from-indigo-500 dark:to-blue-500",
        badge: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30",
      },
      past: {
        primary: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-100 dark:border-purple-900/30",
        accent: "from-purple-600 to-violet-600 dark:from-purple-500 dark:to-violet-500",
        badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/30",
      },
    };
    
    return colors[activeTab as keyof typeof colors];
  };

  // Table actions with modern styling
  const TableActions = () => {
    const colors = getActiveTabColors();
    
    return (
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex-shrink-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className={`w-full sm:w-[180px] gap-1 border h-10 ${colors.border} ${colors.bg}`}>
                <SlidersHorizontal className={`h-4 w-4 ${colors.primary}`} />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className={`border ${colors.border}`}>
                <SelectItem value="all" className={`focus:${colors.bg}`}>All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className={`focus:${colors.bg}`}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className={`flex items-center gap-1.5 hover:cursor-pointer ${colors.border} ${colors.primary} hover:${colors.bg}`}
            disabled={exporting}
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button
            size="sm"
            onClick={exportPDF}
            className={`flex items-center gap-1.5 hover:cursor-pointer bg-gradient-to-r ${colors.accent} text-white dark:text-zinc-900 shadow-sm`}
            disabled={exporting}
          >
            <ArrowDownToLine className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </div>
    );
  };

  // Modern styled pagination controls
  const PaginationControls = ({ totalPages }: { totalPages: number }) => {
    if (totalPages <= 1) return null;
    
    const colors = getActiveTabColors();
    
    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} ${colors.primary} border ${colors.border} hover:${colors.bg}`}
              />
            </PaginationItem>
            
            {getVisiblePages().map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} ${colors.primary} border ${colors.border} hover:${colors.bg}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  // Enhanced table rendering with theme-aware styling
  const renderTable = (data: BookingItem[], includeOutTime = false) => {
    const { paginatedData, totalItems, totalPages } = getPaginatedData(data);
    const colors = getActiveTabColors();

    if (loading) {
      return (
        <div className="space-y-4 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`p-4 border rounded-lg ${colors.border} animate-pulse`}>
              <div className="flex items-center gap-4">
                <Skeleton className={`h-8 w-8 rounded-full ${colors.bg}`} />
                <div className="space-y-2 flex-1">
                  <Skeleton className={`h-4 w-1/3 ${colors.bg}`} />
                  <Skeleton className={`h-4 w-1/4 ${colors.bg}`} />
                </div>
                <Skeleton className={`h-8 w-20 ${colors.bg}`} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (totalItems === 0) {
      return (
        <div className={`text-center py-12 border rounded-lg ${colors.border} ${colors.bg}`}>
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${colors.bg} ${colors.primary} mb-4`}>
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-200">No bookings found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            {selectedCategory !== "all"
              ? "Try adjusting your filter criteria"
              : "There are no bookings in this category yet"}
          </p>
          
          {selectedCategory !== "all" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={`mt-4 ${colors.border} ${colors.primary} hover:${colors.bg}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear filter
            </Button>
          )}
        </div>
      );
    }

    return (
      <TooltipProvider>
        <div className="space-y-4">
          <div className={`rounded-lg border overflow-hidden ${colors.border} shadow-sm`}>
            <Table>
              <TableHeader className={`${colors.bg}`}>
                <TableRow className={`border-b ${colors.border} hover:bg-transparent`}>
                  <TableHead className="w-[100px]">
                    <div
                      className={`flex items-center gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                      onClick={() => handleSort("key")}
                    >
                      <span>Parking #</span>
                      {sortConfig?.key === "key" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className={`flex items-center gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                      onClick={() => handleSort("name")}
                    >
                      <UserRound className="h-3.5 w-3.5 mr-1" />
                      <span>Customer</span>
                      {sortConfig?.key === "name" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className={`flex items-center gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                      onClick={() => handleSort("registrationNumber")}
                    >
                      <Car className="h-3.5 w-3.5 mr-1" />
                      <span>Vehicle Info</span>
                      {sortConfig?.key === "registrationNumber" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className={`flex items-center gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                      onClick={() => handleSort("category")}
                    >
                      <Tag className="h-3.5 w-3.5 mr-1" />
                      <span>Category</span>
                      {sortConfig?.key === "category" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className={`flex items-center gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                      onClick={() => handleSort("location")}
                    >
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>Location</span>
                      {sortConfig?.key === "location" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>
                    <div
                      className={`flex items-center gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                      onClick={() => handleSort("inTime")}
                    >
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>In Time</span>
                      {sortConfig?.key === "inTime" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                  {includeOutTime && (
                    <TableHead>
                      <div
                        className={`flex items-center gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                        onClick={() => handleSort("outTime")}
                      >
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>Out Time</span>
                        {sortConfig?.key === "outTime" ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                        )}
                      </div>
                    </TableHead>
                  )}
                  <TableHead className="text-right">
                    <div
                      className={`flex items-center justify-end gap-1 hover:cursor-pointer ${colors.primary} font-medium`}
                      onClick={() => handleSort("totalSpent")}
                    >
                      <span>Amount</span>
                      {sortConfig?.key === "totalSpent" ? (
                        sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {paginatedData.map((booking, index) => (
                    <motion.tr
                      key={booking.key}
                      className={`group border-b ${colors.border} hover:${colors.bg} hover:dark:bg-black transition-colors`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <TableCell className="font-medium">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`inline-block cursor-help font-mono px-2 py-1 rounded-md ${colors.bg} text-sm`}>
                              {booking.key.slice(0, 4)}...
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-zinc-800 text-white dark:bg-zinc-700 px-3 py-1.5 text-xs border-0">
                            <p className="font-mono">{booking.key}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-900 dark:text-zinc-100">{booking.name}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {booking.company}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md inline-block border border-zinc-200 dark:border-zinc-700">
                          {booking.registrationNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={colors.badge}
                        >
                          {booking.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <MapPin className={`h-3.5 w-3.5 ${colors.primary}`} />
                          <span>{booking.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className={`h-3.5 w-3.5 ${colors.primary}`} />
                          <span>{booking.inTime}</span>
                        </div>
                      </TableCell>
                      {includeOutTime && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className={`h-3.5 w-3.5 ${colors.primary}`} />
                            <span>{booking.outTime}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-right font-semibold text-zinc-900 dark:text-zinc-100">
                        {booking.totalSpent}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          
          <PaginationControls totalPages={totalPages} />
          
          <div className="flex justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
            <span>
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      </TooltipProvider>
    );
  };

  return (
    <motion.div
      className="p-6 min-h-screen bg-background text-foreground transition-colors"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Header Section with Gradient */}
      <motion.div 
        className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/20 shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800/30"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-800/10 dark:to-indigo-800/10 blur-3xl opacity-50"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-blue-200 dark:border-blue-800/30 shadow-sm backdrop-blur-sm">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-200">
                Booking Reports
              </h1>
            </div>
            <p className="text-slate-700/80 dark:text-slate-300/80 ml-1">
              Comprehensive view, filtering, and export tools for all your booking data
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg p-2 border border-blue-100 dark:border-blue-800/30 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                <Timer className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Ongoing</span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{ongoing.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg p-2 border border-blue-100 dark:border-blue-800/30 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Upcoming</span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{upcoming.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg p-2 border border-blue-100 dark:border-blue-800/30 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Completed</span>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">{past.length}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-white dark:bg-black"
      >
        <CardContent className="p-6">
          <Tabs
            defaultValue="ongoing"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center mb-6">
              <TabsList className="p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg">
                {["ongoing", "upcoming", "past"].map((tab) => {
                  const tabStyle = getTabStyles(tab);
                  const counts = {
                    ongoing: ongoing.length,
                    upcoming: upcoming.length, 
                    past: past.length
                  };
                  
                  return (
                    <TabsTrigger 
                      key={tab}
                      value={tab} 
                      className={`group relative px-6 py-2 flex items-center gap-2 data-[state=active]:shadow-md transition-all ${tabStyle.hover}`}
                    >
                      {tabIcons[tab as keyof typeof tabIcons]}
                      <span className="capitalize">{tab}</span>
                      <div className={`px-1.5 py-0.5 text-xs rounded-full ${tabStyle.count} min-w-[20px] text-center`}>
                        {counts[tab as keyof typeof counts]}
                      </div>
                      <div className={`absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 data-[state=active]:opacity-100 ${tabStyle.active}`}></div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TableActions />

            <TabsContent value="ongoing" className="mt-2 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-200">
              {renderTable(ongoing)}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-2 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-200">
              {renderTable(upcoming)}
            </TabsContent>

            <TabsContent value="past" className="mt-2 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-200">
              {renderTable(past, true)}
            </TabsContent>
          </Tabs>

          {/* Footer with count */}
          <div className="mt-8 flex justify-between items-center">
            <Badge 
              variant="outline" 
              className={`py-1.5 px-3 ${getActiveTabColors().badge}`}
            >
              <span className="font-medium">
                {activeTab === "ongoing"
                  ? getFilteredData(ongoing).length
                  : activeTab === "upcoming"
                  ? getFilteredData(upcoming).length
                  : getFilteredData(past).length}
              </span>
              <span className="ml-1 text-zinc-500 dark:text-zinc-400">
                total records
              </span>
            </Badge>
            {selectedCategory !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all");
                }}
                className={`h-9 ${getActiveTabColors().border} ${getActiveTabColors().primary} hover:${getActiveTabColors().bg}`}
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Clear filter
              </Button>
            )}
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  );
};

export default Report;
