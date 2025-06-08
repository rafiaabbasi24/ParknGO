import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import Papa from "papaparse";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import Cookies from "js-cookie";
import { format } from "date-fns";

import { motion, AnimatePresence } from "framer-motion";

// ShadCN UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/ui/bar-chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import {
  Download,
  FileText,
  Search,
  UserCircle2,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  BarChart3,
  Clock,
  Car,
  MapPin,
  RefreshCw,
  FileDown,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";

// Types
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  regDate: string;
  totalSpent: number;
  bookings: Booking[];
}

interface Booking {
  bookId: string;
  parkingLot?: {
    location: string;
    price: number;
  };
  vehicle?: {
    registrationNumber: string;
    status: string;
    inTime: string;
    outTime: string;
  };
}

const UserData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  // Add sorting states
  const [sortField, setSortField] = useState<string | null>(null); // Field being sorted
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | 'none'>('none'); // Sort direction
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Apply sorting even when no search is active
      if (sortField && sortDirection !== 'none') {
        setFilteredUsers(sortUsers([...users], sortField, sortDirection));
      } else {
        setFilteredUsers(users);
      }
    } else {
      const query = searchQuery.toLowerCase();
      let filtered = users.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.mobileNumber?.includes(query)
      );
      
      // Apply sorting to filtered results if sorting is active
      if (sortField && sortDirection !== 'none') {
        filtered = sortUsers(filtered, sortField, sortDirection);
      }
      
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users, sortField, sortDirection]);

  // Sorting function
  const sortUsers = (usersToSort: User[], field: string, direction: 'asc' | 'desc'): User[] => {
    return [...usersToSort].sort((a, b) => {
      let valueA, valueB;
      
      // Determine how to extract the values based on the field
      switch(field) {
        case 'name':
          valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'mobileNumber':
          valueA = a.mobileNumber;
          valueB = b.mobileNumber;
          break;
        case 'regDate':
          valueA = new Date(a.regDate).getTime();
          valueB = new Date(b.regDate).getTime();
          break;
        case 'totalSpent':
          valueA = a.totalSpent || 0;
          valueB = b.totalSpent || 0;
          break;
        default:
          return 0;
      }
      
      // Compare based on direction
      if (direction === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });
  };

  // Handle column header click to toggle sorting
  const handleSortClick = (field: string) => {
    // If clicking on the same field, cycle through directions
    if (sortField === field) {
      if (sortDirection === 'none') setSortDirection('asc');
      else if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('none');
      }
    } else {
      // If clicking on a new field, start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/admin/userData`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setActiveTab("details");
  };

  const exportUserPDF = async () => {
    if (!selectedUser) return;

    try {
      setExportingPdf(true);

      const doc = new jsPDF();

      // Add header with logo and title
      doc.setFillColor(52, 152, 219); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text(
        `User Profile: ${selectedUser.firstName} ${selectedUser.lastName}`,
        105,
        20,
        { align: "center" }
      );

      doc.setFontSize(11);
      doc.text(`Generated on: ${format(new Date(), "PPP p")}`, 105, 30, {
        align: "center",
      });

      // User Basic Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text("User Information", 14, 50);

      const basicInfo = [
        ["Full Name", `${selectedUser.firstName} ${selectedUser.lastName}`],
        ["Email", selectedUser.email],
        ["Phone", selectedUser.mobileNumber],
        ["Registration Date", format(new Date(selectedUser.regDate), "PPP")],
        ["Total Spent", `₹${selectedUser.totalSpent || 0}`],
      ];

      autoTable(doc, {
        startY: 55,
        head: [["Field", "Value"]],
        body: basicInfo,
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
      });

      // Bookings Table
      if (selectedUser.bookings?.length) {
        doc.setFontSize(16);
        doc.text("Booking History", 14, doc.lastAutoTable.finalY + 15);

        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 20,
          head: [["Location", "Vehicle No", "Status", "In Time", "Out Time"]],
          body: selectedUser.bookings.map((booking) => [
            booking.parkingLot?.location || "N/A",
            booking.vehicle?.registrationNumber || "N/A",
            booking.vehicle?.status || "N/A",
            booking.vehicle?.inTime
              ? format(new Date(booking.vehicle.inTime), "PPp")
              : "-",
            booking.vehicle?.outTime
              ? format(new Date(booking.vehicle.outTime), "PPp")
              : "-",
          ]),
          headStyles: { fillColor: [41, 128, 185] },
          styles: { fontSize: 9 },
          alternateRowStyles: { fillColor: [240, 240, 240] },
        });
      }

      // Add footer
      const pageCount = doc.internal.pages.length;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - ParkNGo User Profile`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      doc.save(`User_${selectedUser.firstName}_${selectedUser.lastName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setExportingPdf(false);
    }
  };

  const exportAllUsersCSV = async () => {
    try {
      setExportingCsv(true);

      const csvData = users.map((user) => ({
        Name: `${user.firstName} ${user.lastName}`,
        Email: user.email,
        Phone: user.mobileNumber,
        "Registration Date": format(new Date(user.regDate), "PPP"),
        "Total Spent": `₹${user.totalSpent || 0}`,
        "Bookings Count": user.bookings?.length || 0,
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `ParkNGo_Users_${format(
        new Date(),
        "yyyy-MM-dd"
      )}.csv`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setExportingCsv(false);
    }
  };

  const formatChartData = (bookings: Booking[]) => {
    return bookings
      .filter((booking) => booking.parkingLot?.price)
      .map((booking, index) => ({
        name: booking.parkingLot?.location || `Booking ${index + 1}`,
        value: booking.parkingLot?.price || 0,
      }));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (e) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPp");
    } catch (e) {
      return dateString;
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Header Section with Gradient */}
      <motion.div
        className="relative mb-6 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/20 shadow-xl border border-sky-100 dark:border-sky-900/30"
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
                <UserCircle2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-200">
                User Insights
              </h1>
            </div>
            <p className="text-blue-800/70 dark:text-blue-300/70 font-medium ml-1">
              Comprehensive view of all registered users and their activities
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-500/70 dark:text-blue-400/70" />
              </div>
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 bg-white/80 dark:bg-zinc-900/80 border border-blue-100 dark:border-blue-800/30 text-blue-900 dark:text-blue-100 placeholder-blue-400 dark:placeholder-blue-500/70 rounded-lg backdrop-blur-md"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchUsers()}
              className="h-11 w-11 bg-white/80 dark:bg-zinc-900/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg backdrop-blur-md"
              title="Refresh users"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              onClick={exportAllUsersCSV}
              disabled={exportingCsv || users.length === 0}
              className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20 flex-shrink-0 gap-1.5 rounded-lg"
              title="Export all users to CSV"
            >
              {exportingCsv ? (
                <>
                  <FileSpreadsheet className="h-4 w-4 animate-pulse" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  <span className="hidden sm:inline">Export CSV</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Users Table with Enhanced Styling */}
      <motion.div variants={itemVariants}>
        <Card className="py-0 border border-zinc-200 dark:border-zinc-800 shadow-lg bg-white dark:bg-black overflow-hidden rounded-xl">
          <CardContent className="p-0">
            <div className="rounded-md overflow-hidden">
              {loading ? (
                <div className="p-6 space-y-6 bg-white/50 dark:bg-black/50">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg animate-pulse"
                      >
                        <Skeleton className="h-12 w-12 rounded-full bg-blue-100/70 dark:bg-blue-900/30" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/3 bg-blue-100/70 dark:bg-blue-900/30" />
                          <Skeleton className="h-4 w-1/4 bg-blue-100/70 dark:bg-blue-900/30" />
                        </div>
                        <Skeleton className="h-9 w-24 rounded-md bg-blue-100/70 dark:bg-blue-900/30" />
                      </div>
                    ))}
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/80">
                    <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800">
                      <TableHead 
                        className="w-[250px] text-blue-800 dark:text-blue-200 font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                        onClick={() => handleSortClick('name')}
                      >
                        <div className="flex items-center gap-2">
                          <UserCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>User</span>
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-3.5 w-3.5 text-blue-500" /> : 
                              <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
                          )}
                          {sortField !== 'name' && (
                            <ArrowUpDown className="h-3 w-3 text-blue-400/50 dark:text-blue-500/50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-blue-800 dark:text-blue-200 font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                        onClick={() => handleSortClick('email')}
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Email</span>
                          {sortField === 'email' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-3.5 w-3.5 text-blue-500" /> : 
                              <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
                          )}
                          {sortField !== 'email' && (
                            <ArrowUpDown className="h-3 w-3 text-blue-400/50 dark:text-blue-500/50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="hidden md:table-cell text-blue-800 dark:text-blue-200 font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                        onClick={() => handleSortClick('mobileNumber')}
                      >
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Phone</span>
                          {sortField === 'mobileNumber' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-3.5 w-3.5 text-blue-500" /> : 
                              <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
                          )}
                          {sortField !== 'mobileNumber' && (
                            <ArrowUpDown className="h-3 w-3 text-blue-400/50 dark:text-blue-500/50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="hidden lg:table-cell text-blue-800 dark:text-blue-200 font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                        onClick={() => handleSortClick('regDate')}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Registered</span>
                          {sortField === 'regDate' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-3.5 w-3.5 text-blue-500" /> : 
                              <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
                          )}
                          {sortField !== 'regDate' && (
                            <ArrowUpDown className="h-3 w-3 text-blue-400/50 dark:text-blue-500/50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-right text-blue-800 dark:text-blue-200 font-medium cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
                        onClick={() => handleSortClick('totalSpent')}
                      >
                        <div className="flex items-center gap-2 justify-end">
                          <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Spent</span>
                          {sortField === 'totalSpent' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-3.5 w-3.5 text-blue-500" /> : 
                              <ChevronDown className="h-3.5 w-3.5 text-blue-500" />
                          )}
                          {sortField !== 'totalSpent' && (
                            <ArrowUpDown className="h-3 w-3 text-blue-400/50 dark:text-blue-500/50" />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center text-blue-800 dark:text-blue-200 font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <AnimatePresence>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-10 text-zinc-500 dark:text-zinc-400"
                          >
                            <motion.div
                              className="flex flex-col items-center space-y-3"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400">
                                <UserCircle2 className="h-8 w-8" />
                              </div>
                              <div>
                                <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                                  {searchQuery
                                    ? "No matching users found"
                                    : "No users available"}
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                  {searchQuery
                                    ? "Try adjusting your search query"
                                    : "User data will appear here when available"}
                                </p>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            className="group border-b border-zinc-100 dark:border-zinc-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="font-medium text-zinc-900 dark:text-zinc-100 cursor-default">
                                      {user.firstName} {user.lastName}
                                      <div className="text-xs text-zinc-500 dark:text-zinc-400 md:hidden mt-0.5">
                                        {user.email}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" align="start" className="p-0 overflow-hidden">
                                    <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 flex items-center justify-center text-white font-medium text-lg shadow-sm">
                                        {user?.firstName?.charAt(0)}
                                        {user?.lastName?.charAt(0)}
                                      </div>
                                      <div>
                                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                          {user.firstName} {user.lastName}
                                        </div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                          {user.email}
                                        </div>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>

                            <TableCell className="hidden md:table-cell text-zinc-700 dark:text-zinc-300">
                              {user.email}
                            </TableCell>

                            <TableCell className="hidden md:table-cell text-zinc-700 dark:text-zinc-300 font-mono text-sm">
                              {user.mobileNumber}
                            </TableCell>

                            <TableCell className="hidden lg:table-cell">
                              <div className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs inline-block border border-blue-100 dark:border-blue-800/30">
                                {formatDate(user.regDate)}
                              </div>
                            </TableCell>

                            <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                              ₹{user.totalSpent || 0}
                            </TableCell>

                            <TableCell className="text-right">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openUserDetails(user)}
                                  className="hover:cursor-pointer opacity-70 group-hover:opacity-100 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  <span className="hidden sm:inline">Details</span>
                                </Button>
                              </motion.div>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Details Modal with Premium Styling */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-xl border-0 shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <DialogHeader className="p-6 pb-3 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20">
            <DialogTitle className="flex items-center gap-3 text-2xl text-blue-950 dark:text-blue-200">
              <div className="h-10 w-10 rounded-full bg-white/70 dark:bg-zinc-800/70 flex items-center justify-center border border-blue-200 dark:border-blue-800/30 shadow-sm">
                <UserCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              User Details
            </DialogTitle>
            <DialogDescription className="text-blue-800/70 dark:text-blue-300/70">
              Comprehensive information about the selected user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                  <TabsTrigger
                    value="details"
                    className="hover:cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <UserCircle2 className="h-4 w-4 mr-2" />
                    User Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookings"
                    className="hover:cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm rounded-md transition-all"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Bookings & Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="py-0 border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-black overflow-hidden">
                      <CardHeader className="pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border-b border-zinc-200 dark:border-zinc-800">
                        <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                          <UserCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5 p-5">
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Full Name
                          </span>
                          <span className="font-medium flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                            <UserCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {selectedUser.firstName} {selectedUser.lastName}
                          </span>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Email Address
                          </span>
                          <span className="font-medium flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {selectedUser.email}
                          </span>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Mobile Number
                          </span>
                          <span className="font-medium flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-mono">
                            <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            {selectedUser.mobileNumber}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="py-0 border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-black overflow-hidden">
                      <CardHeader className="pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border-b border-zinc-200 dark:border-zinc-800">
                        <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Account Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5 p-5">
                        <div className="flex flex-col space-y-1.5">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Registration Date
                          </span>
                          <span className="font-medium flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <div className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs inline-block border border-blue-100 dark:border-blue-800/30">
                              {formatDate(selectedUser.regDate)}
                            </div>
                          </span>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Total Spent
                          </span>
                          <span className="font-medium flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                            <CreditCard className="h-4 w-4" />₹
                            {selectedUser.totalSpent || 0}
                          </span>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Booking Count
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                selectedUser.bookings.length > 0
                                  ? "default"
                                  : "outline"
                              }
                              className={
                                selectedUser.bookings.length > 0
                                  ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                  : "text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30"
                              }
                            >
                              {selectedUser.bookings.length} bookings
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="mt-0 space-y-6">
                  <Card className="py-0 border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-black overflow-hidden">
                    <CardHeader className="pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                          <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Booking History
                        </CardTitle>
                        <CardDescription>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/30"
                          >
                            {selectedUser.bookings.length > 0
                              ? `${selectedUser.bookings.length} bookings`
                              : "No bookings"}
                          </Badge>
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {selectedUser.bookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 mb-4">
                            <Car className="h-8 w-8" />
                          </div>
                          <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-1">
                            No bookings found
                          </p>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
                            This user hasn't made any parking bookings yet.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/80">
                              <TableRow className="hover:bg-transparent border-b border-zinc-200 dark:border-zinc-800">
                                <TableHead className="text-blue-800 dark:text-blue-200 font-medium">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span>Location</span>
                                  </div>
                                </TableHead>
                                <TableHead className="text-blue-800 dark:text-blue-200 font-medium">
                                  <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span>Vehicle</span>
                                  </div>
                                </TableHead>
                                <TableHead className="hidden md:table-cell text-blue-800 dark:text-blue-200 font-medium">
                                  Status
                                </TableHead>
                                <TableHead className="hidden md:table-cell text-blue-800 dark:text-blue-200 font-medium">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    <span>Timing</span>
                                  </div>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <AnimatePresence>
                                {selectedUser.bookings.map((booking, index) => (
                                  <motion.tr
                                    key={booking.bookId}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group border-b border-zinc-100 dark:border-zinc-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                                  >
                                    <TableCell className="text-zinc-800 dark:text-zinc-200">
                                      <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-md bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                          <MapPin className="h-3.5 w-3.5" />
                                        </div>
                                        {booking.parkingLot?.location || "N/A"}
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-zinc-700 dark:text-zinc-300 text-sm">
                                      {booking.vehicle?.registrationNumber || "N/A"}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <Badge
                                        variant="outline"
                                        className={
                                          booking.vehicle?.status === "in"
                                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30"
                                            : booking.vehicle?.status === "out"
                                            ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/30"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                                        }
                                      >
                                        {booking.vehicle?.status || "N/A"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      <div className="flex flex-col space-y-1.5">
                                        <div className="flex items-center text-xs">
                                          <span className="text-zinc-500 dark:text-zinc-400 mr-2">
                                            In:
                                          </span>
                                          <span className="text-zinc-800 dark:text-zinc-200">
                                            {booking.vehicle?.inTime
                                              ? formatDateTime(booking.vehicle.inTime)
                                              : "-"}
                                          </span>
                                        </div>
                                        <div className="flex items-center text-xs">
                                          <span className="text-zinc-500 dark:text-zinc-400 mr-2">
                                            Out:
                                          </span>
                                          <span className="text-zinc-800 dark:text-zinc-200">
                                            {booking.vehicle?.outTime
                                              ? formatDateTime(
                                                  booking.vehicle.outTime
                                                )
                                              : "-"}
                                          </span>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </motion.tr>
                                ))}
                              </AnimatePresence>
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {selectedUser.bookings.length > 0 && (
                    <Card className="py-0 border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-black overflow-hidden">
                      <CardHeader className="pt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border-b border-zinc-200 dark:border-zinc-800">
                        <CardTitle className="text-lg text-blue-900 dark:text-blue-100 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          Spending Analytics
                        </CardTitle>
                        <CardDescription className="text-zinc-500 dark:text-zinc-400">
                          Visualization of user's spending per booking
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="h-[350px] w-full bg-white dark:bg-black rounded-lg p-2">
                          <BarChart
                            data={formatChartData(selectedUser.bookings)}
                            valueFormatter={(value) => `₹${value}`}
                            showAnimation={true}
                            color="#3b82f6"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter className="p-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-zinc-50/50 to-zinc-100/50 dark:from-zinc-900/50 dark:to-zinc-800/50">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="hover:cursor-pointer border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Close
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={exportUserPDF}
                disabled={exportingPdf || !selectedUser}
                className="gap-1.5 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
              >
                {exportingPdf ? (
                  <>
                    <Download className="h-4 w-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export PDF</span>
                  </>
                )}
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UserData;
