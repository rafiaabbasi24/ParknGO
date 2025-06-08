import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/utils/backend";
import { Link as LinkR } from "react-router-dom";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (Cookies.get("adminToken")) {
      navigate("/admin/dashboard");
    }
  }, []);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [demoLoading, setDemoLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const validateInputs = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateInputs()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/admin/auth/login`, {
        email,
        password,
      });

      setSuccess("Login successful!");
      Cookies.set("adminToken", res.data.token, { expires: 7 });
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setDemoLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/admin/auth/login`, {
        email: "admin@gmail.com",
        password: "12345678",
      });
      setSuccess("Login successful!");
      Cookies.set("adminToken", res.data.token, { expires: 7 });
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setDemoLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Modern grid background */}
      <div className="absolute inset-0 w-full h-full dark:bg-[length:30px_30px] bg-[length:25px_25px] opacity-[0.03] dark:opacity-[0.07]"></div>
      
      {/* Accent colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Accent dots/circles - minimal and modern */}
        <div className="absolute top-[15%] right-[10%] w-[8px] h-[8px] rounded-full bg-indigo-500 dark:bg-[#0070F3]" />
        <div className="absolute top-[15%] right-[10%] w-[16px] h-[16px] rounded-full bg-indigo-500/20 dark:bg-[#0070F3]/20" />
        <div className="absolute top-[15%] right-[10%] w-[32px] h-[32px] rounded-full bg-indigo-500/10 dark:bg-[#0070F3]/10" />
        
        <div className="absolute bottom-[15%] left-[10%] w-[8px] h-[8px] rounded-full bg-blue-500 dark:bg-[#FF0080]" />
        <div className="absolute bottom-[15%] left-[10%] w-[16px] h-[16px] rounded-full bg-blue-500/20 dark:bg-[#FF0080]/20" />
        <div className="absolute bottom-[15%] left-[10%] w-[32px] h-[32px] rounded-full bg-blue-500/10 dark:bg-[#FF0080]/10" />
        
        {/* Modern accent line */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500 dark:from-[#0070F3] dark:via-[#6C63FF] dark:to-[#FF0080]"></div>
      </div>

      {/* Back to Home button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-4 z-10"
      >
        <LinkR to="/">
          <Button
            variant="ghost"
            size="sm"
            className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 dark:bg-[#111] dark:border-[#333] dark:hover:bg-[#222] dark:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </LinkR>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-[#111] border-slate-200 dark:border-[#222] shadow-xl dark:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] overflow-hidden rounded-xl">
            <CardHeader className="space-y-1 text-center pb-6 relative z-10 border-b border-slate-100 dark:border-[#222]">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white">
                  Admin Login
                </CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Enter your credentials to access the admin dashboard
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10 pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 dark:bg-[#171717] dark:border-[#333] dark:focus:border-[#0070F3] dark:text-white dark:placeholder:text-slate-600"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 dark:bg-[#171717] dark:border-[#333] dark:focus:border-[#0070F3] dark:text-white dark:placeholder:text-slate-600"
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-slate-300 text-indigo-600 dark:border-[#444] dark:data-[state=checked]:bg-[#0070F3] dark:data-[state=checked]:border-[#0070F3]"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-slate-600 dark:text-slate-400"
                  >
                    Remember me for 7 days
                  </Label>
                </motion.div>

                {(error || success) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Alert
                      className={`${
                        error 
                          ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/30 dark:bg-[#301010] dark:text-red-400" 
                          : "border-green-200 bg-green-50 text-green-600 dark:border-green-900/30 dark:bg-[#0F2318] dark:text-green-400"
                      }`}
                    >
                      <AlertDescription>
                        {error || success}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-md shadow-sm dark:bg-[#0070F3] dark:hover:bg-[#005ACC] transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-[#222]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-[#111] px-2 text-slate-500 dark:text-slate-500">
                    Or
                  </span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  onClick={handleDemoLogin}
                  variant="outline"
                  className="w-full border-slate-200 bg-white hover:bg-slate-50 text-slate-800 dark:border-[#333] dark:bg-[#171717] dark:hover:bg-[#1c1c1c] dark:text-white font-medium py-2.5 rounded-md transition-colors"
                  disabled={demoLoading}
                >
                  {demoLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading Demo...
                    </>
                  ) : (
                    "Demo Login"
                  )}
                </Button>
              </motion.div>

            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
