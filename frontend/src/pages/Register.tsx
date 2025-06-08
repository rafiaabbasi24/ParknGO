import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/backend";
import { Link as LinkR } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

import GoogleButton from "@/components/auth/GoogleButton";
import { toast } from "react-hot-toast";

// Icons
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  HomeIcon,
  UserPlus,
  User,
  Phone,
  CheckCircle2,
} from "lucide-react";

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit mobile number" }),
  allowEmails: z.boolean().default(false).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Initialize form with zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobileNumber: "",
      allowEmails: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    const userData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      mobile: values.mobileNumber,
    };

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        userData
      );
      Cookies.set("token", response.data.token, { expires: 7 });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Registration failed";
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
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-950 dark:to-indigo-950/20 p-4 md:p-8">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/3 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-800/10 dark:to-indigo-800/10 blur-3xl opacity-50"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border border-blue-100 dark:border-blue-900/30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <CardHeader className="space-y-1 pb-6">
            <motion.div variants={itemVariants} className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center text-zinc-500 dark:text-zinc-400 mt-1.5">
                Sign up to start using our parking services
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm font-medium">
                          <User className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            autoComplete="given-name"
                            className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm font-medium">
                          <User className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            autoComplete="family-name"
                            className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
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
                        <FormLabel className="text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm font-medium">
                          <Mail className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            autoComplete="email"
                            className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
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
                        <FormLabel className="text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm font-medium">
                          <Lock className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
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
                        <FormLabel className="text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm font-medium">
                          <Phone className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          Mobile Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="9999999999"
                            type="tel"
                            autoComplete="tel"
                            className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="allowEmails"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="allowEmails"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <Label
                          htmlFor="allowEmails"
                          className="text-sm text-zinc-600 dark:text-zinc-400"
                        >
                          I want to receive updates via email
                        </Label>
                      </div>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full h-11 gap-2 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating account...</span>
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

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full border-zinc-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-normal px-2"
                  >
                    Or continue with
                  </Badge>
                </div>
              </div>

              <motion.div variants={itemVariants} className="mt-6">
                <GoogleButton />
              </motion.div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-6 flex flex-col space-y-3">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-1.5">
                <LinkR
                  to="/"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 hover:underline underline-offset-4"
                >
                  <HomeIcon className="h-3.5 w-3.5" />
                  <span>Back to Home</span>
                </LinkR>
              </div>
              <div className="flex items-center gap-1.5">
                <LinkR
                  to="/login"
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5 hover:underline underline-offset-4"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Already have an account</span>
                </LinkR>
              </div>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
