import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/utils/backend";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  Tag,
  KeySquare,
  Timer,
  CreditCard,
  MapPin,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface Category {
  id: string;
  vehicleCat: string;
}

// Helper function to handle the PayU form submission
const post = (path: string, params: Record<string, string>) => {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];
      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
};


// Form validation schema
const formSchema = z.object({
  vehicleCategory: z.string({
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
    .refine((date) => {
      const now = new Date();
      return date > now;
    }, {
      message: "Booking time must be in the future",
    }),
});

const VehicleForm = ({ parkingLotId }: { parkingLotId: string }) => {
  const [vehicleCategories, setVehicleCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeInputValue, setTimeInputValue] = useState("");
  const [locationData, setLocationData] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const navigate = useNavigate();

  // Initialize form with explicit initial values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleCategory: "",
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

  // Fetch location details
  useEffect(() => {
    const fetchLocationData = async () => {
      setLoadingLocation(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/user/getParkings/${parkingLotId}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setLocationData(response.data);
      } catch (error) {
        console.error("Error fetching location:", error);
        toast.error("Failed to fetch location details");
      } finally {
        setLoadingLocation(false);
      }
    };

    if (parkingLotId) {
      fetchLocationData();
    }
  }, [parkingLotId]);

  // Fetch Vehicle Categories
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/admin/category/`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setVehicleCategories(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to fetch vehicle categories");
      }
    };

    fetchVehicles();
  }, []);

  // --- UPDATED onSubmit FUNCTION FOR PAYU ---
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      // Format the data for the API
      const formData = {
        vehicleCategory: values.vehicleCategory,
        vehicleCompanyName: values.vehicleCompanyName,
        registrationNumber: values.registrationNumber,
        inTime: values.inTime.toISOString(),
        parkingLotId
      };

      // 1. Call your backend to get PayU parameters
      const response = await axios.post(
        `${BACKEND_URL}/api/stripe/create-checkout-session`, // This endpoint now handles PayU
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const payuData = response.data;

      // 2. Use the helper function to create and submit the form to PayU
      post(payuData.payu_url, {
        key: payuData.key,
        txnid: payuData.txnid,
        amount: payuData.amount,
        productinfo: payuData.productinfo,
        firstname: payuData.firstname,
        email: payuData.email,
        phone: payuData.phone,
        surl: payuData.surl,
        furl: payuData.furl,
        hash: payuData.hash,
      });
      
    } catch (error: any) {
      console.error("Error during payment session creation:", error);
      const errorMessage = error?.response?.data?.message || "Failed to initiate payment";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Locations
        </Button>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <motion.div variants={itemVariants}>
          {/* Premium Location Card with Gradient Background */}
          <Card className="overflow-hidden border-blue-100 dark:border-blue-900/30 shadow-xl mb-6">
            <div className="h-36 relative overflow-hidden">
              {loadingLocation ? (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 animate-pulse" />
              ) : (
                <>
                  <img 
                    src={locationData?.imgUrl || "/placeholder.svg"} 
                    alt="Parking Location" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/70" />
                </>
              )}

              {!loadingLocation && (
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-300" />
                    <h2 className="text-xl font-bold">{locationData?.location}</h2>
                  </div>
                  <p className="text-sm text-blue-200 mt-1">
                    {locationData?.totalSlot - locationData?.bookedSlot} slots available
                  </p>
                </div>
              )}
            </div>
            
            <CardContent className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 border-t border-blue-100 dark:border-blue-900/30">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">Parking Fee:</span>
                </div>
                <span className="font-bold text-lg text-blue-700 dark:text-blue-300">
                  {loadingLocation ? "Loading..." : `₹${locationData?.price}/hr`}
                </span>
              </div>
            </CardContent>
          </Card>
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
                  <CardTitle className="text-2xl text-blue-950 dark:text-blue-200">Book Parking Slot</CardTitle>
                  <CardDescription className="text-blue-700/70 dark:text-blue-300/70">
                    Fill in your vehicle details to reserve a parking spot
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div 
                    variants={itemVariants}
                    className="space-y-6"
                  >
                    {/* Vehicle Category */}
                    <FormField
                      control={form.control}
                      name="vehicleCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                            <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Vehicle Category
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg">
                                <SelectValue placeholder="Select a vehicle type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-blue-100 dark:border-blue-900/30 bg-white dark:bg-zinc-900">
                              {vehicleCategories.map((category) => (
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
                          <FormDescription className="text-blue-600/70 dark:text-blue-400/70">
                            Choose the category that best matches your vehicle
                          </FormDescription>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />

                    {/* Vehicle Details - Two Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Vehicle Company */}
                      <FormField
                        control={form.control}
                        name="vehicleCompanyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                              <CarFront className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              Company
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Toyota, Honda"
                                {...field}
                                className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
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
                            <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                              <KeySquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              Registration No
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., MH12AB1234"
                                {...field}
                                className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Date & Time Picker */}
                    <FormField
                      control={form.control}
                      name="inTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                            <Timer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Arrival Time
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-11 hover:cursor-pointer pl-3 text-left font-normal bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg",
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
                                      newDate.setMinutes(field.value.getMinutes());
                                    } else {
                                      // Set a default time (e.g., current time + 1 hour)
                                      const now = new Date();
                                      newDate.setHours(now.getHours() + 1);
                                      newDate.setMinutes(0);
                                      
                                      // Update the time input
                                      setTimeInputValue(format(newDate, "HH:mm"));
                                    }
                                    
                                    field.onChange(newDate);
                                  }
                                }}
                                disabled={(date) => {
                                  // Disable past days
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
                                  <Label className="text-blue-700 dark:text-blue-300">Time:</Label>
                                  <Input
                                    type="time"
                                    className="w-full bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
                                    value={timeInputValue}
                                    onChange={(e) => {
                                      try {
                                        // Always update the controlled input value
                                        setTimeInputValue(e.target.value);
                                        
                                        // Only proceed if we have a selected date and valid time
                                        if (field.value && e.target.value) {
                                          const [hours, minutes] = e.target.value.split(":");
                                          
                                          if (hours && minutes) {
                                            // Create a new date object to avoid mutating the original
                                            const newDate = new Date(field.value);
                                            newDate.setHours(parseInt(hours, 10));
                                            newDate.setMinutes(parseInt(minutes, 10));
                                            
                                            // Validate the date before setting it
                                            if (!isNaN(newDate.getTime())) {
                                              field.onChange(newDate);
                                            }
                                          }
                                        }
                                      } catch (error) {
                                        console.error("Error setting time:", error);
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormDescription className="text-blue-600/70 dark:text-blue-400/70">
                            Select when you plan to arrive at the parking location
                          </FormDescription>
                          <FormMessage className="text-red-500 dark:text-red-400" />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex justify-end gap-3 pt-4 border-t border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/5">
              <motion.div 
                className="w-full"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                variants={itemVariants}
              >
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={loading || !form.formState.isValid}
                  className="w-full h-11 gap-2 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Safety Badge */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 flex justify-center"
        >
          <div className="flex items-center gap-2 text-sm text-blue-600/70 dark:text-blue-400/70 bg-blue-50/80 dark:bg-blue-950/30 rounded-full px-4 py-2 border border-blue-100 dark:border-blue-900/30">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {/* Updated safety badge text */}
            <span>Secured payment with PayU</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VehicleForm;