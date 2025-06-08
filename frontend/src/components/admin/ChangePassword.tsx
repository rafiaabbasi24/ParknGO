import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/utils/backend';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";

// ShadCN UI components
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icons
import { 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Save, 
  Loader2, 
  AlertCircle, 
  Lock, 
  CheckCircle2, 
  XCircle,
  Info
} from "lucide-react";

// Form validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
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

const getStrengthLabel = (strength: number): { label: string, color: string } => {
  if (strength <= 25) return { label: 'Weak', color: 'text-red-500 dark:text-red-400' };
  if (strength <= 50) return { label: 'Fair', color: 'text-amber-500 dark:text-amber-400' };
  if (strength <= 75) return { label: 'Good', color: 'text-blue-500 dark:text-blue-400' };
  return { label: 'Strong', color: 'text-emerald-500 dark:text-emerald-400' };
};

const getStrengthColor = (strength: number): string => {
  if (strength <= 25) return 'bg-red-500 dark:bg-red-400';
  if (strength <= 50) return 'bg-amber-500 dark:bg-amber-400';
  if (strength <= 75) return 'bg-blue-500 dark:bg-blue-400';
  return 'bg-emerald-500 dark:bg-emerald-400';
};

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Initialize form with zod resolver
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Watch the new password to calculate strength
  const newPassword = form.watch("newPassword");
  
  // Update password strength when password changes
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

  const onSubmit = async (values: PasswordFormValues) => {
    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found!");
      return;
    }

    try {
      setLoading(true);
      
      await axios.post(
        `${BACKEND_URL}/api/admin/changepassword`, 
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
      toast.success("Password changed successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Failed to change password";
      toast.error(errorMessage);
      form.setError("currentPassword", { 
        type: "manual", 
        message: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  // Strength rating component
  const strengthDetails = getStrengthLabel(passwordStrength);

  // Animation variants
  const securityVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 } 
    }
  };

  // Password requirements
  const passwordRequirements = [
    { 
      id: 'length', 
      label: 'At least 8 characters', 
      check: () => newPassword?.length >= 8,
      icon: <span className="text-xs">🔤</span>
    },
    { 
      id: 'uppercase', 
      label: 'Contains uppercase letter', 
      check: () => /[A-Z]/.test(newPassword || ''),
      icon: <span className="text-xs">🔠</span>
    },
    { 
      id: 'lowercase', 
      label: 'Contains lowercase letter', 
      check: () => /[a-z]/.test(newPassword || ''),
      icon: <span className="text-xs">🔡</span>
    },
    { 
      id: 'number', 
      label: 'Contains a number', 
      check: () => /[0-9]/.test(newPassword || ''),
      icon: <span className="text-xs">🔢</span>
    }
  ];

  return (
    <motion.div 
      className="p-6"
      initial="hidden"
      animate="visible"
      variants={securityVariants}
    >
      <div className="max-w-xl mx-auto">
        <Card className="overflow-hidden border-blue-100 dark:border-blue-900/30 shadow-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-blue-50/70 to-cyan-50/70 dark:from-blue-950/30 dark:to-cyan-950/20 border-b border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/30 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-950 dark:text-blue-200">Security Settings</CardTitle>
                <CardDescription className="text-blue-700/70 dark:text-blue-300/70">
                  Update your password to keep your account secure
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                        <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
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
                        <div className="mt-2 space-y-1.5">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-zinc-500 dark:text-zinc-400">Password Strength:</span>
                            <span className={strengthDetails.color + " font-medium"}>
                              {strengthDetails.label}
                            </span>
                          </div>
                          <Progress value={passwordStrength} className="h-1.5 bg-zinc-200 dark:bg-zinc-700">
                            <div 
                              className={`h-full ${getStrengthColor(passwordStrength)}`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </Progress>
                        </div>
                      )}
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password requirements checklist */}
                <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/10 rounded-lg border border-blue-100 dark:border-blue-900/30 p-4 space-y-2">
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-1">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Password Requirements
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {passwordRequirements.map(req => (
                      <div 
                        key={req.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {req.check() ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                        )}
                        <span className={req.check() 
                          ? "text-zinc-800 dark:text-zinc-200" 
                          : "text-zinc-500 dark:text-zinc-400"
                        }>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Tips */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3 text-sm flex items-start gap-2.5 cursor-help">
                        <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 dark:text-amber-300 font-medium">Security Tip</p>
                          <p className="text-amber-700/70 dark:text-amber-400/70 text-xs mt-0.5">
                            Never use the same password for multiple accounts. Consider using a password manager.
                          </p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm bg-zinc-800 text-white dark:bg-zinc-700 p-3">
                      <p className="text-sm">
                        Using unique passwords for different accounts is essential for your online security. If one account is compromised, your others remain safe.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="px-6 py-4 border-t border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:to-cyan-950/5">
            <motion.div 
              className="w-full"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading || !form.formState.isValid} 
                className="w-full h-11 gap-2 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-400 dark:hover:to-cyan-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
              >
                {loading ? (
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