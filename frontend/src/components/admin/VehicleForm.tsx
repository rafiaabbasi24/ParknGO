import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "../../utils/backend";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Icons
import {
  CalendarIcon,
  CarFront,
  ArrowLeft,
  Timer,
  User,
  Tag,
  KeySquare,
  ParkingSquare,
  CheckCircle2,
} from "lucide-react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Category {
  id: string;
  vehicleCat: string;
}

// Form validation schema
const formSchema = z.object({
  userId: z.string({
    required_error: "Please select a user",
  }),
  vehicleCategoryId: z.string({
    required_error: "Please select a vehicle category",
  }),
  vehicleCompanyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(50, { message: "Company name must be less than 50 characters" }),
  registrationNumber: z
    .string()
    .min(5, { message: "Registration number must be at least 5 characters" })
    .max(20, {
      message: "Registration number must be less than 20 characters",
    }),
  inTime: z
    .date({
      required_error: "Please select a date and time",
    })
    .refine(
      (date) => {
        const now = new Date();
        // Add 1 minute to current time
        const minTime = new Date(now.getTime() + 60 * 1000);
        return date >= minTime;
      },
      {
        message: "Booking time must be at least 1 minute in the future",
      }
    ),
});

const VehicleForm = ({ parkingLotId }: { parkingLotId: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [timeInputValue, setTimeInputValue] = useState(""); // State to control time input
  const navigate = useNavigate();

  // Initialize form with explicit initial values to avoid controlled/uncontrolled warning
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      vehicleCategoryId: "",
      vehicleCompanyName: "",
      registrationNumber: "",
      inTime: undefined,
    },
  });

  // Watch the inTime value to update the time input when date changes
  const selectedDate = form.watch("inTime");

  // Update time input whenever selected date changes
  useEffect(() => {
    if (selectedDate) {
      const formattedTime = format(selectedDate, "HH:mm");
      setTimeInputValue(formattedTime);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("adminToken");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const res = await axios.get(
        `${BACKEND_URL}/api/admin/showRegisteredUsers`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const fetchCategories = async () => {
    try {
      const token = Cookies.get("adminToken");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const res = await axios.get(`${BACKEND_URL}/api/admin/category/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    // Extra validation for date/time
    if (!values.inTime || isNaN(values.inTime.getTime())) {
      toast.error("Please select a valid date and time");
      return;
    }

    // Ensure the date is at least 1 minute in the future
    const now = new Date();
    const minTime = new Date(now.getTime() + 60 * 1000);
    if (values.inTime < minTime) {
      toast.error("Booking time must be at least 1 minute in the future");
      return;
    }

    const payload = {
      parkingLotId,
      customerId: values.userId,
      vehicleCategoryId: values.vehicleCategoryId,
      vehicleCompanyName: values.vehicleCompanyName,
      registrationNumber: values.registrationNumber,
      inTime: values.inTime.toISOString(),
      paymentId: null,
    };

    try {
      setSubmitting(true);
      const res = await axios.post(`${BACKEND_URL}/api/admin/book`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Booking successful!");
      form.reset({
        userId: "",
        vehicleCategoryId: "",
        vehicleCompanyName: "",
        registrationNumber: "",
        inTime: undefined,
      });
      setTimeInputValue("");
      navigate(`/booking-status?token=${res.data.verifytoken}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Booking failed!";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Motion variants
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
      className="min-h-screen p-6 bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/10 text-foreground"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Back button */}
      <motion.div variants={itemVariants}>
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 hover:cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          onClick={() => navigate("/admin/bookings")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <motion.div variants={itemVariants}>
          {/* Premium Header with Gradient Background */}
          <div className="relative mb-6 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 shadow-lg border border-blue-100 dark:border-blue-900/30">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="p-3 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-blue-200 dark:border-blue-800/30 shadow-sm backdrop-blur-sm">
                <ParkingSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-200">
                  Vehicle Booking
                </h1>
                <p className="text-blue-900/70 dark:text-blue-300/70 font-medium">
                  Complete the form below to book a parking slot
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-xl border-blue-100 dark:border-blue-900/30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center">
                  <CarFront className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-blue-950 dark:text-blue-200">
                    Book a Vehicle
                  </CardTitle>
                  <CardDescription className="text-blue-700/70 dark:text-blue-300/70">
                    Fill in the details to reserve a parking slot
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* User Selection */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-blue-700 dark:text-blue-300 font-medium">
                            <User className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            Customer
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 rounded-lg">
                                <SelectValue placeholder="Select a customer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-blue-100 dark:border-blue-900/30 bg-white dark:bg-zinc-900">
                              {users.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id}
                                  className="focus:bg-blue-50 dark:focus:bg-blue-900/20"
                                >
                                  {user.firstName} {user.lastName} (
                                  <span className="text-blue-500 dark:text-blue-400">
                                    {user.email}
                                  </span>
                                  )
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-blue-600/70 dark:text-blue-400/70">
                            Customer who is booking the parking slot
                          </FormDescription>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Vehicle Category with enhanced styling */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="vehicleCategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-blue-700 dark:text-blue-300 font-medium">
                            <Tag className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            Vehicle Category
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 rounded-lg">
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-blue-100 dark:border-blue-900/30 bg-white dark:bg-zinc-900">
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                  className="focus:bg-blue-50 dark:focus:bg-blue-900/20"
                                >
                                  {category.vehicleCat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Vehicle Details - Two Columns with glass morphism effect */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* Vehicle Company */}
                    <FormField
                      control={form.control}
                      name="vehicleCompanyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-blue-700 dark:text-blue-300 font-medium">
                            <CarFront className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            Company
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Toyota"
                              {...field}
                              className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 rounded-lg"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Registration Number */}
                    <FormField
                      control={form.control}
                      name="registrationNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-blue-700 dark:text-blue-300 font-medium">
                            <KeySquare className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            Reg. Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., MH12AB1234"
                              {...field}
                              className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 rounded-lg"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Date & Time Picker with premium styling */}
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="inTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="flex items-center text-blue-700 dark:text-blue-300 font-medium">
                            <Timer className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" />
                            Arrival Time
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 hover:cursor-pointer pl-3 text-left font-normal bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 rounded-lg",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP HH:mm")
                                  ) : (
                                    <span>Pick a date and time</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 border-blue-100 dark:border-blue-900/30 bg-white dark:bg-zinc-900"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    // Preserve the current time when changing the date
                                    const newDate = new Date(date);

                                    if (field.value) {
                                      // If there's already a time set, preserve it
                                      newDate.setHours(field.value.getHours());
                                      newDate.setMinutes(
                                        field.value.getMinutes()
                                      );
                                    } else {
                                      // Set a default time (e.g., current time + 1 hour)
                                      const now = new Date();
                                      newDate.setHours(now.getHours() + 1);
                                      newDate.setMinutes(0);

                                      // Update the time input
                                      setTimeInputValue(
                                        format(newDate, "HH:mm")
                                      );
                                    }

                                    field.onChange(newDate);
                                  }
                                }}
                                disabled={(date) => {
                                  // Allow same day if it's today, only disable past days
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  const compareDate = new Date(date);
                                  compareDate.setHours(0, 0, 0, 0);
                                  return compareDate < today;
                                }}
                                initialFocus
                                className="rounded-md border-blue-100 dark:border-blue-900/30"
                              />
                              <div className="p-3 border-t border-blue-100 dark:border-blue-900/30">
                                <div className="flex items-center gap-2">
                                  <Label className="text-blue-700 dark:text-blue-300">
                                    Time:
                                  </Label>
                                  <Input
                                    type="time"
                                    className="w-full bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0 rounded-lg"
                                    value={timeInputValue}
                                    onChange={(e) => {
                                      try {
                                        // Always update the controlled input value
                                        setTimeInputValue(e.target.value);

                                        // Only proceed if we have a selected date and valid time
                                        if (field.value && e.target.value) {
                                          const [hours, minutes] =
                                            e.target.value.split(":");

                                          if (hours && minutes) {
                                            // Create a new date object to avoid mutating the original
                                            const newDate = new Date(
                                              field.value
                                            );
                                            newDate.setHours(
                                              parseInt(hours, 10)
                                            );
                                            newDate.setMinutes(
                                              parseInt(minutes, 10)
                                            );

                                            // Validate the date before setting it
                                            if (!isNaN(newDate.getTime())) {
                                              field.onChange(newDate);
                                            }
                                          }
                                        }
                                      } catch (error) {
                                        console.error(
                                          "Error setting time:",
                                          error
                                        );
                                        // Don't update if there's an error
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormDescription className="text-blue-600/70 dark:text-blue-400/70">
                            Booking time must be at least 1 minute from now
                          </FormDescription>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <CardFooter className="flex justify-end gap-3 px-0 pt-6 border-t border-blue-100 dark:border-blue-900/30">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/bookings")}
                        disabled={submitting}
                        className="bg-white dark:bg-transparent border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="gap-2 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {submitting ? "Booking..." : "Book Now"}
                      </Button>
                    </CardFooter>
                  </motion.div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VehicleForm;
