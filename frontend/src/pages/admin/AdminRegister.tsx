import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";

// ShadCN UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Icons
import {
  UserCircle,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  BellRing,
  LogIn,
} from "lucide-react";

// Form validation schema
const formSchema = z.object({
  adminName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot exceed 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit mobile number" }),
  notifications: z.boolean(),
});

// Define form values type explicitly to match the zod schema
type FormValues = z.infer<typeof formSchema>;

export default function AdminRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (Cookies.get("adminToken")) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // Initialize form with zod resolver - ensure the form and schema match exactly
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adminName: "",
      email: "",
      password: "",
      mobileNumber: "",
      notifications: false, // Make sure this is definitely boolean, not undefined
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    const userData = {
      adminName: values.adminName,
      email: values.email,
      password: values.password,
      mobileNumber: values.mobileNumber,
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/admin/auth/register`,
        userData
      );

      Cookies.set("adminToken", response.data.token, { expires: 7 });

      toast.success("Admin account created successfully!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.1, staggerChildren: 0.1 },
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
      className="min-h-screen w-full py-12 px-4 sm:px-6 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-zinc-950"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[60rem] w-[90rem] -translate-x-1/2 opacity-20 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-blue-400 dark:to-indigo-400"></div>
        </div>
      </div>

      <motion.div variants={itemVariants} className="w-full max-w-md">
        <Card className="border-blue-100 dark:border-blue-900/30 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <CardHeader className="space-y-1 pb-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-2">
              <UserCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-950 dark:text-blue-200">
              Admin Register
            </CardTitle>
            <CardDescription className="text-blue-700/70 dark:text-blue-400/70">
              Create an admin account to manage the parking system
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="adminName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <UserCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Full Name</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/60 dark:text-blue-400/60" />
                            <Input
                              placeholder="John Doe"
                              className="pl-10 h-10 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Email</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/60 dark:text-blue-400/60" />
                            <Input
                              placeholder="admin@example.com"
                              type="email"
                              className="pl-10 h-10 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Password</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/60 dark:text-blue-400/60" />
                            <Input
                              placeholder="••••••"
                              type="password"
                              className="pl-10 h-10 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span>Mobile Number</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/60 dark:text-blue-400/60" />
                            <Input
                              placeholder="9999999999"
                              className="pl-10 h-10 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-sm" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="leading-none">
                          <FormLabel className="text-sm font-medium leading-none flex items-center gap-1.5">
                            <BellRing className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            Email notifications
                          </FormLabel>
                          <p className="text-xs text-muted-foreground mt-1">
                            Receive updates and important notifications via
                            email.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gap-1.5 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 h-10 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/5">
            <div className="w-full flex items-center justify-center gap-2">
              <Separator className="w-1/3 bg-blue-100 dark:bg-blue-900/30" />
              <span className="text-xs text-blue-600/70 dark:text-blue-400/70">
                or
              </span>
              <Separator className="w-1/3 bg-blue-100 dark:bg-blue-900/30" />
            </div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full h-10 gap-2 bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  className="h-4 w-4"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign up with Google
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-4 text-center">
              <p className="text-sm text-blue-700/70 dark:text-blue-400/70">
                Already have an account?{" "}
                <RouterLink
                  to="/admin/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                >
                  Sign in <LogIn className="inline-block h-3.5 w-3.5 ml-0.5" />
                </RouterLink>
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-2 text-center">
              <p className="text-xs text-blue-600/60 dark:text-blue-400/60">
                <RouterLink
                  to="/"
                  className="hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                >
                  Return to Home
                </RouterLink>
              </p>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
