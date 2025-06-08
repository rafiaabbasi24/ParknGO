import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Icons
import {
  Eye,
  EyeOff,
  Save,
  Loader2,
  KeyRound,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// Form validation schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required",
    }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string().min(1, {
      message: "Please confirm your password",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

// Password strength checker
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 25;

  // Character checks
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;

  // Cap at 100
  return Math.min(100, strength);
};

const getStrengthLabel = (strength: number): { label: string; color: string } => {
  if (strength <= 25)
    return { label: "Weak", color: "text-red-500 dark:text-red-400" };
  if (strength <= 50)
    return { label: "Fair", color: "text-amber-500 dark:text-amber-400" };
  if (strength <= 75)
    return { label: "Good", color: "text-blue-500 dark:text-blue-400" };
  return { label: "Strong", color: "text-emerald-500 dark:text-emerald-400" };
};

const getStrengthColor = (strength: number): string => {
  if (strength <= 25) return "bg-red-500 dark:bg-red-400";
  if (strength <= 50) return "bg-amber-500 dark:bg-amber-400";
  if (strength <= 75) return "bg-blue-500 dark:bg-blue-400";
  return "bg-emerald-500 dark:bg-emerald-400";
};

const ChangePassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const newPassword = form.watch("newPassword");

  // Update password strength when password changes
  useState(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  });

  const onSubmit = async (values: PasswordFormValues) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await axios.post(
        `${BACKEND_URL}/api/user/changepassword`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      form.reset();
      setSuccess(true);
      toast.success("Password changed successfully!");

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to change password";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Password requirements
  const passwordRequirements = [
    {
      id: "length",
      label: "At least 8 characters",
      check: () => newPassword?.length >= 8,
    },
    {
      id: "uppercase",
      label: "Contains uppercase letter",
      check: () => /[A-Z]/.test(newPassword || ""),
    },
    {
      id: "lowercase",
      label: "Contains lowercase letter",
      check: () => /[a-z]/.test(newPassword || ""),
    },
    {
      id: "number",
      label: "Contains a number",
      check: () => /[0-9]/.test(newPassword || ""),
    },
  ];

  // Animation variants
  const securityVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Strength rating
  const strengthDetails = getStrengthLabel(passwordStrength);

  return (
    <motion.div
      className="flex justify-center p-6"
      initial="hidden"
      animate="visible"
      variants={securityVariants}
    >
      <div className="w-full max-w-2xl">
        <Card className="overflow-hidden border-blue-100 dark:border-blue-900/30 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/20 border-b border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-950 dark:text-blue-200">
                  Change Password
                </CardTitle>
                <CardDescription className="text-blue-700/70 dark:text-blue-400/70">
                  Update your password to keep your account secure
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {success && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your password has been updated successfully.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {error && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                        Current Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter your current password"
                            className="pr-10 h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:cursor-pointer focus:outline-none"
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        New Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter your new password"
                            className="pr-10 h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setPasswordStrength(calculatePasswordStrength(e.target.value));
                            }}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:cursor-pointer focus:outline-none"
                          tabIndex={-1}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Password strength meter */}
                      {newPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 dark:text-zinc-400">
                              Password Strength:
                            </span>
                            <span className={strengthDetails.color + " font-medium"}>
                              {strengthDetails.label}
                            </span>
                          </div>
                          <Progress
                            value={passwordStrength}
                            className="h-1.5 bg-zinc-200 dark:bg-zinc-700"
                          >
                            <div
                              className={`h-full ${getStrengthColor(passwordStrength)}`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </Progress>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                        Confirm New Password
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className="pr-10 h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:cursor-pointer focus:outline-none"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password requirements checklist */}
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 rounded-lg border border-blue-100 dark:border-blue-900/30 p-4 space-y-2">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Password Requirements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {passwordRequirements.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {req.check() ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                        )}
                        <span
                          className={
                            req.check()
                              ? "text-zinc-800 dark:text-zinc-200"
                              : "text-zinc-500 dark:text-zinc-400"
                          }
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Tip</AlertTitle>
                  <AlertDescription>
                    Never use the same password for multiple accounts. Consider using
                    a password manager.
                  </AlertDescription>
                </Alert>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="px-6 py-4 border-t border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/5">
            <motion.div
              className="w-full"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={submitting || !form.formState.isValid}
                className="w-full h-11 gap-2 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/10 border border-blue-700/10"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Update Password</span>
                  </>
                )}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default ChangePassword;