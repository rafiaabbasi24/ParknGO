import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";
import { motion } from "framer-motion";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Icons
import { Tag, Plus, Loader2, CheckCircle2, CarFront, Info } from "lucide-react";

interface AddCategoryProps {
  onCategoryAdded: () => void;
}

const AddCategory = ({ onCategoryAdded }: AddCategoryProps) => {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/category/add`,
        { vehicleCat: category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Category added successfully!");
        setRecentlyAdded([...recentlyAdded, category]);
        setCategory("");
        onCategoryAdded();
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to add category";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center">
          <motion.div
            className=""
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border border-violet-100 dark:border-violet-900/30 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center border border-violet-100 dark:border-violet-800/30">
                    <Tag className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-zinc-900 dark:text-zinc-100">
                      Add New Category
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400">
                      Create a new vehicle category for your system
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  id="add-category-form"
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-zinc-800 dark:text-zinc-200"
                    >
                      Category Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="category"
                        type="text"
                        placeholder="e.g., 2 Wheeler, SUV, Sedan"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="pl-10 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-12 rounded-lg focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-0"
                      />
                      <Tag className="absolute left-3 top-3.5 h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      Give your category a clear and descriptive name
                    </p>
                  </div>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col items-start border-t border-zinc-100 dark:border-zinc-800 pt-4">
                <Button
                  type="submit"
                  form="add-category-form"
                  disabled={loading || !category.trim()}
                  className="w-full h-11 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg shadow-md shadow-violet-500/10 transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Category</span>
                    </div>
                  )}
                </Button>

                {recentlyAdded.length > 0 && (
                  <div className="mt-6 w-full bg-violet-50 dark:bg-violet-900/20 rounded-lg p-4 border border-violet-100 dark:border-violet-800/30">
                    <div className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                      <span>Recently Added Categories</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentlyAdded.slice(-5).map((cat, idx) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-zinc-800 text-violet-700 dark:text-violet-300 rounded-full px-3 py-1.5 text-xs font-medium border border-violet-200 dark:border-violet-700/30 flex items-center gap-1.5 shadow-sm"
                        >
                          <CarFront className="h-3 w-3" />
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
