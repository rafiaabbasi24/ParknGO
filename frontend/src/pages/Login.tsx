import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import GoogleButton from "@/components/auth/GoogleButton";

// Icons
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  HomeIcon,
  UserPlus,
} from "lucide-react";

// Form validation schemas
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
  remember: z.boolean().default(false).optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type FormValues = z.infer<typeof formSchema>;
type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function SignIn() {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  // Forgot password modal states
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] =
    React.useState(false);
  const [forgotPasswordError, setForgotPasswordError] = React.useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = React.useState("");

  React.useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: data.email,
        password: data.password,
      });

      setSuccess("Login successful!");
      Cookies.set("token", res.data.token, {
        expires: data.remember ? 7 : 1,
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (data: ForgotPasswordValues) => {
    setForgotPasswordError("");
    setForgotPasswordSuccess("");

    try {
      setForgotPasswordLoading(true);
      await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, {
        email: data.email,
      });

      setForgotPasswordSuccess(
        "Password reset link sent to your email if you are registered. Please check your inbox."
      );
      forgotPasswordForm.reset();

      // Close modal after 2 seconds
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setForgotPasswordSuccess("");
      }, 2000);
    } catch (err: any) {
      setForgotPasswordError(
        err?.response?.data?.message || "Failed to send reset email"
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordOpen(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess("");
    forgotPasswordForm.reset();
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
                <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-center text-zinc-500 dark:text-zinc-400 mt-1.5">
                Sign in to your account to continue
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
                            autoComplete="current-password"
                            className="h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-400 text-xs font-medium" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between"
                >
                  <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-zinc-600 dark:text-zinc-400"
                        >
                          Remember me
                        </Label>
                      </div>
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 font-medium"
                  >
                    Forgot password?
                  </button>
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
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
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
                  to="/register"
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1.5 hover:underline underline-offset-4"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Create Account</span>
                </LinkR>
              </div>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Forgot Password Modal */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md border border-blue-100 dark:border-blue-900/30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-zinc-500 dark:text-zinc-400">
              Enter your email address and we'll send you a link to reset your
              password.
            </DialogDescription>
          </DialogHeader>

          <Form {...forgotPasswordForm}>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">
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

              {forgotPasswordError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg p-3 flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {forgotPasswordError}
                  </p>
                </div>
              )}

              {forgotPasswordSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-lg p-3 flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {forgotPasswordSuccess}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="flex-1 h-11 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  disabled={forgotPasswordLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium"
                  disabled={forgotPasswordLoading}
                >
                  {forgotPasswordLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
