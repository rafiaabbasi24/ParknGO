import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// ShadCN UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Icons
import {
  Loader2,
  ParkingSquare,
  MapPin,
  ImageIcon,
  CreditCard,
  Warehouse,
} from "lucide-react";

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

const AddParkingLot = () => {
  const [loading, setLoading] = useState(false);

  // Initialize form with zod resolver
  const form = useForm<ParkingLotFormValues>({
    resolver: zodResolver(parkingLotSchema),
    defaultValues: {
      location: "",
      imgUrl: "",
      totalSlot: 1,
      price: 0,
    },
  });

  const onSubmit = async (values: ParkingLotFormValues) => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/admin/addParkingLot`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
      });
      toast.success("Parking lot added successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to add parking lot."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 rounded-2xl p-6 mb-6 shadow-xl transition-colors duration-300">
        {/* Decorative elements */}
        <div className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full -ml-12 -mb-12 opacity-50"></div>

          <div className="relative z-10 flex items-start gap-5">
            <div className="h-14 w-14 rounded-xl bg-indigo-500/20 dark:bg-indigo-500/30 flex items-center justify-center border border-indigo-500/20 dark:border-indigo-400/30">
              <ParkingSquare className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-950 dark:text-indigo-200 tracking-tight">
                Add New Parking Lot
              </h1>
              <p className="text-indigo-900/70 dark:text-indigo-300/70 text-sm font-medium mt-1">
                Create a new parking location in your management system with all
                necessary details
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-zinc-950">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium">
                        <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/50">
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Downtown Parking, Mall Garage"
                          {...field}
                          className="h-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-indigo-500/30"
                        />
                      </FormControl>
                      <FormDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Enter a descriptive name for this parking location
                      </FormDescription>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imgUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium">
                        <div className="p-1.5 rounded-md bg-violet-50 dark:bg-violet-950/50">
                          <ImageIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        Image URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/parking-image.jpg"
                          {...field}
                          className="h-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-indigo-500/30"
                        />
                      </FormControl>
                      <FormDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Provide a URL to an image representing this parking lot
                      </FormDescription>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <FormField
                    control={form.control}
                    name="totalSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium">
                          <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50">
                            <Warehouse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          Total Slots
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            className="h-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-indigo-500/30"
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                          Number of available parking slots
                        </FormDescription>
                        <FormMessage className="text-red-500 dark:text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-medium">
                          <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/50">
                            <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          Price (per hour)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            {...field}
                            className="h-12 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-indigo-500/30"
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-500 dark:text-zinc-400 text-sm">
                          Hourly rate in ₹ (INR)
                        </FormDescription>
                        <FormMessage className="text-red-500 dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => form.reset()}
                  disabled={loading}
                  className="h-11 px-5 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-md shadow-indigo-500/20 font-medium gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ParkingSquare className="h-4 w-4" />
                      <span>Add Parking Lot</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddParkingLot;
