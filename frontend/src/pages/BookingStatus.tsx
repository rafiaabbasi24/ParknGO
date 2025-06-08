import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ReactConfetti from "react-confetti";
import { motion } from "framer-motion";

// ShadCN UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  AlertTriangle,
  Calendar,
  Car,
  Check,
  ChevronsRight,
  Clock,
  MapPin,
  PartyPopper,
  User,
} from "lucide-react";
import { toast } from "sonner";

const BookingStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- FIX: Initialize status based on URL parameter ---
  const searchParams = new URLSearchParams(location.search);
  const initialStatus = searchParams.get("status") || "failed"; // Default to 'failed' if no status is found
  const transactionId = searchParams.get("txnid");

  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState("");
  const [redirectTimer, setRedirectTimer] = useState<number | null>(null);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);
  const [confettiDimensions, setConfettiDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    //if no token is found, redirect to home
    if (!Cookies.get("token") && !Cookies.get("adminToken")) {
      toast.error("You must be logged in to view this page.");
      navigate("/");
      return;
    }

    // --- FIX: Set timer based on the initial status from URL ---
    if (initialStatus === "success") {
      setRedirectTimer(10);
      setShowConfetti(true);
    } else {
      setError("Your payment could not be processed. Please try again.");
      setRedirectTimer(5);
    }
  }, [initialStatus, navigate]);


  // Handle redirection based on status
  useEffect(() => {
    if (redirectTimer === 0) {
      // Determine where to redirect based on status and available tokens
      if (status === "success") {
        if (Cookies.get("adminToken")) {
          navigate("/admin/reports");
        } else if (Cookies.get("token")) {
          navigate("/reports");
        } else {
          navigate("/");
        }
      } else if (status === "failed" || status === "error") {
        if (Cookies.get("adminToken")) {
          navigate("/admin/bookings");
        } else if (Cookies.get("token")) {
          navigate("/bookings");
        } else {
          navigate("/");
        }
      }
    }

    // Decrement timer if set
    if (redirectTimer !== null && redirectTimer > 0) {
      const timeout = setTimeout(() => {
        setRedirectTimer(redirectTimer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [redirectTimer, status, navigate]);

  // Handle confetti dimensions and position
  useEffect(() => {
    if (confettiRef.current && status === "success") {
      const { clientWidth, clientHeight } = confettiRef.current;
      setConfettiDimensions({
        width: clientWidth,
        height: clientHeight,
      });

      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status]);


  // Function to handle navigation to reports
  const handleViewReport = () => {
    if (Cookies.get("adminToken")) {
      navigate("/admin/reports");
    } else if (Cookies.get("token")) {
      navigate("/reports");
    } else {
      navigate("/");
    }
  };

  // Function to handle navigation to bookings
  const handleViewBookings = () => {
    if (Cookies.get("adminToken")) {
      navigate("/admin/bookings");
    } else if (Cookies.get("token")) {
      navigate("/bookings");
    } else {
      navigate("/");
    }
  };

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
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-zinc-950"
      ref={confettiRef}
    >
      {/* Confetti overlay - only show on success */}
      {showConfetti && status === "success" && (
        <ReactConfetti
          width={confettiDimensions.width}
          height={confettiDimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          colors={[
            "#8b5cf6", // violet
            "#3b82f6", // blue
            "#10b981", // emerald
            "#f59e0b", // amber
            "#ec4899", // pink
          ]}
        />
      )}

      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[60rem] w-[90rem] -translate-x-1/2 opacity-20 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-blue-400 dark:to-indigo-400"></div>
        </div>
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="border border-blue-100 dark:border-blue-900/30 shadow-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-xl overflow-hidden">
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                status === "success"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-red-500 to-pink-500"
              }`}
            ></div>

            <CardHeader className="pb-3">
              {status === "success" ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                      <PartyPopper className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl text-green-950 dark:text-green-200">
                    Booking Successful!
                  </CardTitle>
                  <CardDescription className="text-center text-green-700/70 dark:text-green-400/70">
                    Your parking spot has been reserved.
                    {redirectTimer !== null && (
                      <div className="mt-2 text-xs">
                        Redirecting to reports in {redirectTimer} second
                        {redirectTimer !== 1 ? "s" : ""}...
                      </div>
                    )}
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <CardTitle className="text-center text-xl text-red-950 dark:text-red-200">
                    Booking Failed
                  </CardTitle>
                  <CardDescription className="text-center text-red-700/70 dark:text-red-400/70">
                    {error || "There was an issue with your booking."}
                    {redirectTimer !== null && (
                      <div className="mt-2 text-xs">
                        Redirecting to bookings in {redirectTimer} second
                        {redirectTimer !== 1 ? "s" : ""}...
                      </div>
                    )}
                  </CardDescription>
                </>
              )}
            </CardHeader>

            {status === "success" && (
              <>
                <CardContent className="pb-3 space-y-4">
                  <Separator className="bg-green-100 dark:bg-green-900/30" />
                  <div className="rounded-lg border border-green-100 dark:border-green-800/30 bg-green-50/50 dark:bg-green-900/10 p-4">
                    <h3 className="text-sm font-medium mb-3 text-green-800 dark:text-green-300">
                      Transaction Details
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Transaction ID:
                        </span>
                        <span className="font-medium text-green-800 dark:text-green-200">
                          {transactionId || 'N/A'}
                        </span>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            <CardFooter className="flex flex-col gap-3 pt-2">
              {status === "success" ? (
                <>
                  <Button
                    onClick={handleViewReport}
                    className="w-full gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-400 dark:hover:to-emerald-400 text-white dark:text-zinc-900 h-10 font-medium shadow-md shadow-green-500/10 dark:shadow-green-400/5 border border-green-700/10 dark:border-green-300/20"
                  >
                    <ChevronsRight className="h-4 w-4" />
                    View My Bookings
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleViewBookings}
                    className="w-full gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 h-10 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
                  >
                    <Car className="h-4 w-4" />
                    Try Again
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingStatus;
