import { useState, ReactNode } from "react";
import { generateInvoicePDF } from "@/components/user/Invoice";
import { format } from "date-fns";

// ShadCN UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import {
  Search,
  SortAsc,
  SortDesc,
  Car,
  Clock,
  Building,
  MapPin,
  Calendar,
  Filter,
  CreditCard,
  Tag,
  FileDown,
  X,
  MoreVertical,
} from "lucide-react";

// UI Components
import { EmptyState } from "./EmptyState";

interface BookingsTableProps {
  bookings: any[];
  loading: boolean;
  profile: any;
  type: "ongoing" | "upcoming" | "past";
  icon?: ReactNode;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  loading,
  profile,
  type,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  
  const pageSize = 5;

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort the filtered bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    
    // Handle date fields separately
    if (key === "inTime" || key === "outTime") {
      const dateA = new Date(a[key]).getTime();
      const dateB = new Date(b[key]).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    // Handle numeric fields
    if (key === "totalSpent") {
      return direction === "asc" 
        ? (a[key] || 0) - (b[key] || 0) 
        : (b[key] || 0) - (a[key] || 0);
    }
    
    // Handle string fields
    const valueA = a[key] || "";
    const valueB = b[key] || "";
    return direction === "asc" 
      ? valueA.localeCompare(valueA) 
      : valueB.localeCompare(valueA);
  });

  // Paginate the sorted bookings
  const paginatedBookings = sortedBookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const totalPages = Math.ceil(sortedBookings.length / pageSize);

  // Handle sort
  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }
    
    setSortConfig({ key, direction });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy • h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  // Get table header cell with sort
  const getSortableHeader = (label: string, key: string, icon: ReactNode) => (
    <div
      className="flex items-center gap-1.5 cursor-pointer group"
      onClick={() => requestSort(key)}
    >
      {icon}
      <span>{label}</span>
      <div className="flex flex-col h-3 justify-center ml-0.5">
        <SortAsc
          className={`h-2 w-2 ${
            sortConfig?.key === key && sortConfig?.direction === "asc"
              ? "text-blue-500"
              : "text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 dark:group-hover:text-zinc-500"
          }`}
        />
        <SortDesc
          className={`h-2 w-2 -mt-0.5 ${
            sortConfig?.key === key && sortConfig?.direction === "desc"
              ? "text-blue-500"
              : "text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-400 dark:group-hover:text-zinc-500"
          }`}
        />
      </div>
    </div>
  );
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 bg-blue-100/50 dark:bg-blue-900/20" />
          <Skeleton className="h-10 w-40 bg-blue-100/50 dark:bg-blue-900/20" />
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="bg-zinc-50 dark:bg-zinc-900 p-4">
            <div className="grid grid-cols-6 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full bg-blue-100/50 dark:bg-blue-900/20" />
              ))}
            </div>
          </div>
          <div className="p-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="py-4 space-y-3">
                <div className="grid grid-cols-6 gap-4">
                  {Array(6).fill(0).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-full bg-blue-100/50 dark:bg-blue-900/20" />
                  ))}
                </div>
                {i < 2 && <div className="border-b border-zinc-200 dark:border-zinc-800 mt-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return <EmptyState type={type} />;
  }

  // Display info when filtered results are empty
  if (filteredBookings.length === 0 && searchQuery) {
    return (
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <Search className="h-7 w-7 text-blue-500 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">No results found</h3>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          No bookings match your search query "{searchQuery}". Try adjusting your search or clear filters.
        </p>
        <Button
          variant="outline" 
          onClick={() => setSearchQuery("")}
          className="mt-2"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-10 h-10 border-zinc-200 dark:border-zinc-800 focus:border-blue-300 dark:focus:border-blue-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {searchQuery && (
            <Badge variant="outline" className="gap-1.5 px-3 py-1 h-10 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400">
              <Filter className="h-3.5 w-3.5" />
              <span>
                {filteredBookings.length} {filteredBookings.length === 1 ? 'result' : 'results'}
              </span>
              <button 
                onClick={() => setSearchQuery("")}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Main table */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
            <TableRow className="hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80">
              <TableHead className="w-[100px]">
                {getSortableHeader("Company", "company", <Building className="h-3.5 w-3.5" />)}
              </TableHead>
              <TableHead>
                {getSortableHeader("Reg No", "registrationNumber", <Car className="h-3.5 w-3.5" />)}
              </TableHead>
              <TableHead className="hidden md:table-cell">
                {getSortableHeader("Category", "category", <Tag className="h-3.5 w-3.5" />)}
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                {getSortableHeader("Location", "location", <MapPin className="h-3.5 w-3.5" />)}
              </TableHead>
              <TableHead>
                {getSortableHeader("In Time", "inTime", <Calendar className="h-3.5 w-3.5" />)}
              </TableHead>
              {type === "past" && (
                <TableHead>
                  {getSortableHeader("Out Time", "outTime", <Clock className="h-3.5 w-3.5" />)}
                </TableHead>
              )}
              <TableHead>
                {getSortableHeader("Total", "totalSpent", <CreditCard className="h-3.5 w-3.5" />)}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.map((booking, _index) => (
              <TableRow 
                key={booking.id} 
                className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
              >
                <TableCell className="font-medium">
                  {booking.company || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-mono text-xs">
                    {booking.registrationNumber}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {booking.category || "N/A"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400 mr-1" />
                    <span className="truncate max-w-[120px]">{booking.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    {formatDate(booking.inTime)}
                  </div>
                </TableCell>
                {type === "past" && (
                  <TableCell>
                    <div className="text-xs">
                      {formatDate(booking.outTime)}
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <Badge className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/30">
                    ₹{booking.totalSpent || 0}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => profile && generateInvoicePDF(booking, profile)}
                        disabled={!profile}
                        className="cursor-pointer"
                      >
                        <FileDown className="h-4 w-4 mr-2" />
                        Download Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePageChange(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};
