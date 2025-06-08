import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/backend";
import { Link as LinkR } from "react-router-dom";
import * as React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Shadcn components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  HomeIcon,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

// Form validation schema
const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Please confirm your password.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordValues) => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/api/auth/reset-password`, {
        newPassword: data.newPassword,
        token: token,
      });

      setSuccess("Password updated successfully! Redirecting to login...");
      form.reset();
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

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
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-2"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100">
                Reset Password
              </CardTitle>
              <CardDescription className="text-center text-zinc-500 dark:text-zinc-400 mt-1.5">
                Enter your new password below
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm font-medium">
                          <Lock className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-sm font-medium">
                          <Lock className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {error && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg p-3 flex items-start gap-2.5"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    variants={itemVariants}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg p-3 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {success}
                    </p>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full h-11 gap-2 hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
                    disabled={loading || !token}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <LinkR
                    to="/signin"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1.5 hover:underline underline-offset-4 font-medium"
                  >
                    <HomeIcon className="h-3.5 w-3.5" />
                    <span>Back to Sign In</span>
                  </LinkR>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
