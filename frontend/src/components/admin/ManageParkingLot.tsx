import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/utils/backend";
import { toast } from "react-hot-toast";

// ShadCN UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Icons
import {
  Pencil,
  Search,
  Loader2,
  ParkingSquare,
  ArrowUpDown,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ParkingLot = {
  id: string;
  location: string;
  imgUrl: string;
  totalSlot: number;
  bookedSlot: number;
  price: number;
};

// Form validation schema
const parkingLotSchema = z.object({
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters" }),
  imgUrl: z.string().url({ message: "Please enter a valid image URL" }),
  totalSlot: z.coerce
    .number()
    .positive({ message: "Total slots must be a positive number" }),
  price: z.coerce
    .number()
    .nonnegative({ message: "Price must be zero or positive" }),
});

type ParkingLotFormValues = z.infer<typeof parkingLotSchema>;

const ManageParkingLot = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [filteredLots, setFilteredLots] = useState<ParkingLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [updating, setUpdating] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Initialize form
  const form = useForm<ParkingLotFormValues>({
    resolver: zodResolver(parkingLotSchema),
    defaultValues: {
      location: "",
      imgUrl: "",
      totalSlot: 1,
      price: 0,
    },
  });

  useEffect(() => {
    fetchParkingLots();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = parkingLots.filter((lot) =>
        lot.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLots(filtered);
    } else {
      setFilteredLots(parkingLots);
    }
  }, [searchQuery, parkingLots]);

  const fetchParkingLots = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("adminToken");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.get(`${BACKEND_URL}/api/user/getParkings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParkingLots(response.data);
      setFilteredLots(response.data);
    } catch (error) {
      console.error("Error fetching parking lots:", error);
      toast.error("Failed to load parking lots");
    } finally {
      setLoading(false);
    }
  };

  const editParkingLot = (lot: ParkingLot) => {
    setSelectedLot(lot);
    form.reset({
      location: lot.location,
      imgUrl: lot.imgUrl,
      totalSlot: lot.totalSlot,
      price: lot.price,
    });
    setIsEditDialogOpen(true);
  };

  const onSubmit = async (values: ParkingLotFormValues) => {
    if (!selectedLot) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setUpdating(true);
      const response = await axios.patch(
        `${BACKEND_URL}/api/admin/addParkingLot/${selectedLot.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParkingLots((prev) =>
        prev.map((lot) =>
          lot.id === selectedLot.id ? { ...response.data } : lot
        )
      );

      setIsEditDialogOpen(false);
      toast.success("Parking lot updated successfully!");
    } catch (error) {
      console.error("Error updating parking lot:", error);
      toast.error("Failed to update parking lot");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = (lot: ParkingLot) => {
    setSelectedLot(lot);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLot) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setUpdating(true);
      await axios.delete(
        `${BACKEND_URL}/api/admin/addParkingLot/${selectedLot.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setParkingLots((prev) => prev.filter((lot) => lot.id !== selectedLot.id));
      setFilteredLots((prev) =>
        prev.filter((lot) => lot.id !== selectedLot.id)
      );

      setIsDeleteDialogOpen(false);
      toast.success("Parking lot deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting parking lot:", error);
      toast.error(
        "Failed to delete parking lot " + error?.response?.data?.message
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if already sorting by this column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }

    // Sort the data
    const sorted = [...filteredLots].sort((a: any, b: any) => {
      if (column === "location") {
        return sortDirection === "asc"
          ? a.location.localeCompare(b.location)
          : b.location.localeCompare(a.location);
      } else {
        return sortDirection === "asc"
          ? a[column] - b[column]
          : b[column] - a[column];
      }
    });

    setFilteredLots(sorted);
  };

  return (
    <div className="space-y-8">
      {/* Premium Header Section with Dark/Light Mode Support */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 rounded-2xl p-8 shadow-xl transition-colors duration-300">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-2.5 rounded-lg border border-indigo-500/20 dark:border-indigo-400/20">
                <ParkingSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-xl font-semibold text-indigo-950 dark:text-indigo-200 tracking-tight">
                Manage Parking Lots
              </h1>
            </div>
            <p className="text-indigo-900/70 dark:text-indigo-300/70 text-sm font-medium">
              View and manage all your parking locations from a centralized
              dashboard
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-indigo-500/70 dark:text-indigo-400/70" />
              </div>
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 h-10 bg-white/80 dark:bg-zinc-800/80 border border-indigo-100 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-200 placeholder:text-indigo-400/70 dark:placeholder:text-indigo-500/50 rounded-lg backdrop-blur-md focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 text-sm shadow-sm transition-colors duration-200"
              />
            </div>
            <Button
              variant="outline"
              onClick={fetchParkingLots}
              className="flex-shrink-0 flex items-center gap-2 py-2 h-10 px-4 bg-white/80 dark:bg-zinc-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-lg backdrop-blur-md transition-all duration-200 text-sm shadow-sm"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="font-medium">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Stats Overview Section */}
        {!loading && filteredLots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col gap-2 p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
              <div className="text-indigo-500 dark:text-indigo-400 text-sm font-medium">
                Total Locations
              </div>
              <div className="text-3xl font-bold">{filteredLots.length}</div>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
              <div className="text-emerald-500 dark:text-emerald-400 text-sm font-medium">
                Total Parking Slots
              </div>
              <div className="text-3xl font-bold">
                {filteredLots.reduce((acc, lot) => acc + lot.totalSlot, 0)}
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
              <div className="text-amber-500 dark:text-amber-400 text-sm font-medium">
                Available Slots
              </div>
              <div className="text-3xl font-bold">
                {filteredLots.reduce(
                  (acc, lot) => acc + (lot.totalSlot - lot.bookedSlot),
                  0
                )}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl"
                >
                  <Skeleton className="h-20 w-20 rounded-xl" />
                  <div className="space-y-3 flex-1">
                    <Skeleton className="h-6 w-2/5 rounded-lg" />
                    <div className="flex gap-3">
                      <Skeleton className="h-5 w-24 rounded-md" />
                      <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-[120px] py-4">Image</TableHead>
                  <TableHead>
                    <div
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={() => handleSort("location")}
                    >
                      <span>Location</span>
                      <div className="bg-zinc-200 dark:bg-zinc-800 rounded p-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-3 w-3 text-zinc-700 dark:text-zinc-300" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center gap-2 cursor-pointer group"
                      onClick={() => handleSort("totalSlot")}
                    >
                      <span>Total Slots</span>
                      <div className="bg-zinc-200 dark:bg-zinc-800 rounded p-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-3 w-3 text-zinc-700 dark:text-zinc-300" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center gap-2 cursor-pointer group"
                      onClick={() => handleSort("bookedSlot")}
                    >
                      <span>Occupancy</span>
                      <div className="bg-zinc-200 dark:bg-zinc-800 rounded p-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-3 w-3 text-zinc-700 dark:text-zinc-300" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div
                      className="flex items-center justify-center gap-2 cursor-pointer group"
                      onClick={() => handleSort("price")}
                    >
                      <span>Price</span>
                      <div className="bg-zinc-200 dark:bg-zinc-800 rounded p-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <ArrowUpDown className="h-3 w-3 text-zinc-700 dark:text-zinc-300" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLots.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-16 text-zinc-500"
                    >
                      {searchQuery ? (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                            <Search className="h-10 w-10 text-zinc-400" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xl font-medium">
                              No matching parking lots found
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                              We couldn't find any parking lots matching "
                              {searchQuery}". Try adjusting your search.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                            <ParkingSquare className="h-10 w-10 text-zinc-400" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xl font-medium">
                              No parking lots available
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              Add new parking lots to get started.
                            </p>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLots.map((lot) => (
                    <TableRow
                      key={lot.id}
                      className="group hover:bg-zinc-50 dark:hover:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800"
                    >
                      <TableCell className="py-4">
                        <div className="w-8 h-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
                          <img
                            src={lot.imgUrl}
                            alt={lot.location}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-medium text-[15px] leading-tight text-zinc-800 dark:text-zinc-100">
                            {lot.location}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">
                            ID: {lot.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                          {lot.totalSlot}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className={`
                          inline-flex items-center gap-1 px-2.5 py-0.5 text-xs rounded-md font-medium
                          ${
                            lot.bookedSlot >= 0.9 * lot.totalSlot
                              ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                              : lot.bookedSlot >= 0.6 * lot.totalSlot
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          }
                        `}
                        >
                          <span>
                            {lot.bookedSlot}/{lot.totalSlot}
                          </span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              lot.bookedSlot >= 0.9 * lot.totalSlot
                                ? "bg-red-500"
                                : lot.bookedSlot >= 0.6 * lot.totalSlot
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          ></span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium">
                          <span className="text-[15px] leading-tight">
                            ₹{lot.price}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-0.5">
                            / hr
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editParkingLot(lot)}
                            className="h-8 px-3 bg-transparent border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md text-zinc-700 dark:text-zinc-200 transition-all duration-200 text-xs"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1.5" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lot)}
                            className="h-8 w-8 p-0 bg-transparent border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md text-red-600 dark:text-red-400 transition-all duration-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg border-0 rounded-2xl shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-black/95">
          <DialogHeader className="space-y-3 pb-2">
            <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">
              Edit Parking Lot
            </DialogTitle>
            <DialogDescription className="text-base text-zinc-600 dark:text-zinc-400">
              Update the details for{" "}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {selectedLot?.location}
              </span>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-4"
            >
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-900 dark:text-zinc-200 font-medium text-base">
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imgUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-900 dark:text-zinc-200 font-medium text-base">
                        Image URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-base"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 dark:text-zinc-200 font-medium text-base">
                          Total Slots
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-900 dark:text-zinc-200 font-medium text-base">
                          Price (₹ per hour)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-base"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={updating}
                  className="h-12 px-6 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updating}
                  className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-md shadow-indigo-500/20 font-medium text-white"
                >
                  {updating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 rounded-2xl shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-black/95">
          <DialogHeader className="space-y-3 pb-2">
            <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-500">
              Delete Parking Lot
            </DialogTitle>
            <DialogDescription className="text-base text-zinc-600 dark:text-zinc-400">
              Are you sure you want to delete the parking lot{" "}
              <span className="font-medium text-zinc-900 dark:text-white">
                "{selectedLot?.location}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl flex items-start gap-3">
            <div className="text-red-600 dark:text-red-400 mt-1">⚠️</div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Deleting this parking lot will remove all associated data and
              cannot be recovered. Current bookings may be affected.
            </div>
          </div>

          <DialogFooter className="pt-4 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={updating}
              className="h-12 px-6 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={updating}
              onClick={confirmDelete}
              className="h-12 px-6 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl shadow-md shadow-red-500/20 font-medium text-white"
            >
              {updating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageParkingLot;
