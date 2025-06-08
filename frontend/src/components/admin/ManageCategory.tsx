import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  Pencil,
  Trash2,
  Search,
  Tag,
  RotateCcw,
  Calendar,
  Filter,
  CarFront,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryType {
  id: string;
  vehicleCat: string;
  creationDate: string;
}

const ManageCategory = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [editValue, setEditValue] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchCategories = async () => {
    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/admin/category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to fetch categories";
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setEditValue(category.vehicleCat);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmEdit = async () => {
    if (!selectedCategory || !editValue.trim()) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found!");
      return;
    }

    try {
      setUpdating(true);
      const res = await axios.patch(
        `${BACKEND_URL}/api/admin/category/${selectedCategory.id}`,
        { vehicleCat: editValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id ? { ...cat, ...res.data } : cat
        )
      );

      toast.success("Category updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update category");
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found!");
      return;
    }

    try {
      setUpdating(true);
      await axios.delete(
        `${BACKEND_URL}/api/admin/category/${selectedCategory.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Category deleted successfully!");
      fetchCategories();
      setIsDeleteDialogOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete category";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.vehicleCat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-100 dark:border-violet-800/30">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-violet-500 blur-3xl"></div>
          <div className="absolute bottom-5 right-10 w-32 h-32 rounded-full bg-purple-500 blur-3xl"></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 p-5">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-violet-100 dark:border-violet-800/30 shadow-sm">
                <CarFront className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-medium text-violet-800 dark:text-violet-200">
                Vehicle Categories
              </h3>
            </div>
            <p className="text-violet-600/80 dark:text-violet-400/80 text-sm">
              Manage all vehicle categories in your system efficiently
            </p>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-violet-500/70 dark:text-violet-400/70" />
              </div>
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full h-10 bg-white/80 dark:bg-zinc-800/80 border border-violet-100 dark:border-violet-800/30 text-violet-900 dark:text-violet-100 placeholder:text-violet-400 dark:placeholder:text-violet-500/70 rounded-lg backdrop-blur-md focus-visible:ring-1 focus-visible:ring-violet-500 focus-visible:ring-offset-0 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchCategories}
              className="h-10 w-10 flex-shrink-0 bg-white/80 dark:bg-zinc-800/80 hover:bg-violet-50 dark:hover:bg-violet-900/30 border border-violet-100 dark:border-violet-800/30 text-violet-700 dark:text-violet-300 rounded-lg backdrop-blur-md transition-all duration-200"
              title="Refresh"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg animate-pulse"
                >
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-6 w-32 rounded-md" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-10 w-20 rounded-md" />
                </div>
              ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-violet-50 dark:bg-violet-950/20">
                <TableRow className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-16 text-center font-medium text-violet-800 dark:text-violet-200">
                    No.
                  </TableHead>
                  <TableHead className="font-medium text-violet-800 dark:text-violet-200">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>Category</span>
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-medium text-violet-800 dark:text-violet-200">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Created</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-medium text-violet-800 dark:text-violet-200">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-10 text-zinc-500"
                      >
                        <motion.div
                          className="flex flex-col items-center space-y-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-violet-50 dark:bg-violet-950/30">
                            <Tag className="h-6 w-6 text-violet-400 dark:text-violet-500" />
                          </div>
                          <div>
                            <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                              {searchQuery
                                ? "No matching categories found"
                                : "No categories available"}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                              {searchQuery
                                ? "Try adjusting your search query"
                                : "Create a new category to get started"}
                            </p>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category, index) => (
                      <motion.tr
                        key={category.id}
                        className="group border-b border-zinc-200 dark:border-zinc-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        whileHover={{
                          backgroundColor: "rgba(124, 58, 237, 0.05)",
                        }}
                      >
                        <TableCell className="text-center text-zinc-500 dark:text-zinc-400 text-sm">
                          <div className="flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xs text-violet-700 dark:text-violet-300 font-medium">
                              {index + 1}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800/30">
                              <CarFront className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200 text-sm">
                              {category.vehicleCat}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-violet-50 dark:bg-violet-900/30 px-2 py-1 rounded-md text-violet-700 dark:text-violet-300 font-medium">
                              {formatDate(category.creationDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 bg-transparent hover:bg-violet-50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg transition-all duration-200"
                              onClick={() => handleEdit(category)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100 bg-transparent hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200"
                              onClick={() => handleDelete(category)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Category count badge */}
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="px-3 py-1.5 bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-800/30 text-violet-700 dark:text-violet-300 rounded-lg text-xs font-medium">
          <span>{filteredCategories.length}</span>
          <span className="ml-1 text-violet-500 dark:text-violet-400/80">
            {filteredCategories.length === 1 ? "category" : "categories"}{" "}
            {searchQuery && " matched"}
          </span>
        </Badge>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="h-8 text-xs bg-transparent hover:bg-violet-50 dark:hover:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg"
          >
            <Filter className="h-3 w-3 mr-1" />
            Clear filter
          </Button>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 rounded-xl shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-black/95">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-medium text-zinc-900 dark:text-white flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Pencil className="h-3 w-3 text-violet-600 dark:text-violet-400" />
              </div>
              <span>Edit Vehicle Category</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400 text-sm">
              Update the name of this vehicle category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-3">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="category-name"
                className="text-right text-zinc-700 dark:text-zinc-300 text-sm"
              >
                Name
              </Label>
              <Input
                id="category-name"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="col-span-3 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 border-0 focus-visible:ring-2 focus-visible:ring-violet-500/30 text-sm"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updating}
              className="h-10 px-4 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmEdit}
              disabled={!editValue.trim() || updating}
              className="h-10 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-lg shadow-sm text-white font-medium"
            >
              {updating ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 rounded-xl shadow-2xl backdrop-blur-sm bg-white/95 dark:bg-black/95">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-medium text-red-600 dark:text-red-500 flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
              </div>
              <span>Confirm Deletion</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400 text-sm">
              Are you sure you want to delete the category "
              <span className="font-medium text-zinc-900 dark:text-white">
                {selectedCategory?.vehicleCat}
              </span>
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-start gap-2 text-xs text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30">
            <div className="mt-0.5">⚠️</div>
            <div>
              Deleting a category may affect existing records and cannot be reversed.
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={updating}
              className="h-10 px-4 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={updating}
              className="h-10 px-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-lg shadow-sm text-white font-medium"
            >
              {updating ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ManageCategory;
