import { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/utils/backend";
import { ThemeContext } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

// ShadCN components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ShadCN Bar Chart components - Added for replacing Recharts
import { BarChart } from "@/components/ui/bar-chart";

// Icons
import {
  Calendar,
  Clock,
  CreditCard,
  History,
  RefreshCw,
  TrendingUp,
  CircleDot,
  ChartBar,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  CalendarClock,
  Wallet,
  CalendarDays,
  Timer,
  TimerOff,
  Info,
  LayoutDashboard,
  BarChart3,
} from "lucide-react";

// Enhanced color palette
const COLORS = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ec4899", // pink
  "#8b5cf6", // violet
];

const CustomTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-3 shadow-lg rounded-lg border ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-800"
            : "bg-white border-zinc-200"
        }`}
      >
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center mt-1 text-sm">
            <div
              className="w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.name}: </span>
            <span className="ml-1">
              {entry.dataKey === "value" ? "₹" : ""}
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const UserDashboard = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("overview");

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get(`${BACKEND_URL}/api/user/dashboardData`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setDashboardData(res.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-56 bg-indigo-100/50 dark:bg-indigo-900/20 mb-2" />
            <Skeleton className="h-5 w-80 bg-indigo-100/50 dark:bg-indigo-900/20" />
          </div>
          <Skeleton className="h-10 w-28 bg-indigo-100/50 dark:bg-indigo-900/20" />
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-14 w-full rounded-lg bg-indigo-100/50 dark:bg-indigo-900/20" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 rounded-xl bg-indigo-100/50 dark:bg-indigo-900/20"
            />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[350px] rounded-xl bg-indigo-100/50 dark:bg-indigo-900/20"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center p-10 h-[70vh]">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
          <Info className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-200">
          No Data Available
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-4">
          We couldn't retrieve your dashboard data at the moment.
        </p>
        <Button
          onClick={fetchDashboardData}
          className="bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // Process data for charts
  const {
    upcomingBooking,
    totalBookings,
    totalTimeParked,
    totalSpent,
    monthlyBookingHistory,
    timeSpentBuckets,
    spendingOverTime,
  } = dashboardData;

  // FIX: Provide a fallback empty object `{}` to prevent crashes if `monthlyBookingHistory` is null or undefined.
  const bookingHistory = Object.entries(monthlyBookingHistory || {})
    .map(([month, bookings]) => ({ month, bookings: Number(bookings) })) // Ensure bookings is a number
    .sort((a, b) => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  // FIX: Provide a fallback empty object `{}`.
  const timeSpentData = Object.entries(timeSpentBuckets || {})
    .map(([label, value]) => ({ name: label, value: Number(value) })) // Ensure value is a number
    .filter((item) => item.value > 0);

  // FIX: Provide a fallback empty object `{}`.
  const spendingData = Object.entries(spendingOverTime || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value: Number(value) })); // Ensure value is a number

  const pieChartFlag = timeSpentData.length > 0;
  const spendingChartFlag = spendingData.some((item) => item.value > 0);

  // IMPROVEMENT: Calculate the most active month once to avoid repeating logic.
  const mostActiveMonth = bookingHistory.length > 0
    ? bookingHistory.reduce(
        (max, current) => (max.bookings > current.bookings ? max : current),
        { month: "None", bookings: 0 }
      ).month
    : "None";

  const nextBookingStatus =
    upcomingBooking === null
      ? "none"
      : new Date(upcomingBooking) < new Date()
      ? "overdue"
      : "scheduled";

  // Calculate utilization percentage
  const totalHours = 720; // assuming 30 days x 24 hours as max
  const utilizationPercentage = Math.min(
    100,
    (totalTimeParked / totalHours) * 100
  );

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Header Section with Gradient */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20 rounded-2xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-800/30"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-100 dark:bg-violet-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-800/10 dark:to-indigo-800/10 blur-3xl opacity-50"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-indigo-950 dark:text-indigo-200">
              Welcome Back 👋
            </h1>
            <p className="text-indigo-700/70 dark:text-indigo-300/70 mt-1">
              Here's an overview of your parking activities and statistics
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Modern Tab Navigation */}
      <motion.div
        variants={itemVariants}
        className="overflow-hidden bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center border-b border-zinc-200 dark:border-zinc-800 px-2 bg-gradient-to-r from-zinc-50/80 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-800/80">
            <TabsList className="h-14 bg-transparent rounded-none border-0 p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-500 rounded-none border-0 h-full px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 transition-all gap-2 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 dark:data-[state=active]:border-indigo-500 rounded-none border-0 h-full px-6 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 transition-all gap-2 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Activity</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 bg-gradient-to-b from-white to-zinc-50/50 dark:from-black dark:to-zinc-900/50">
            <AnimatePresence mode="wait">
              {/* Overview Tab Content */}
              <TabsContent
                value="overview"
                className="mt-0 space-y-6 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
              >
                {/* Summary Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <motion.div variants={itemVariants} className="group">
                    <Card className="rounded-xl overflow-hidden border-indigo-100 dark:border-indigo-800/30 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-900 group-hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-indigo-600/70 dark:text-indigo-400/70 flex items-center">
                              <CalendarClock className="h-3.5 w-3.5 mr-1" />
                              Next Booking
                            </p>
                            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1">
                              {upcomingBooking === null
                                ? "None"
                                : dayjs(upcomingBooking).format("DD MMM")}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              {upcomingBooking === null
                                ? "No upcoming bookings"
                                : dayjs(upcomingBooking).format("hh:mm A")}
                            </p>
                          </div>
                          <div
                            className={`
                              px-2.5 py-1 rounded-lg border ${
                                nextBookingStatus === "none"
                                  ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                                  : nextBookingStatus === "overdue"
                                  ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400"
                                  : "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                              }`}
                          >
                            <span className="text-xs font-medium capitalize">
                              {nextBookingStatus === "none"
                                ? "None"
                                : nextBookingStatus}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants} className="group">
                    <Card className="rounded-xl overflow-hidden border-blue-100 dark:border-blue-800/30 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-900 group-hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-blue-600/70 dark:text-blue-400/70 flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              Total Bookings
                            </p>
                            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                              {totalBookings}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              All time reservations
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants} className="group">
                    <Card className="rounded-xl overflow-hidden border-emerald-100 dark:border-emerald-800/30 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-900 group-hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70 flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              Time Parked
                            </p>
                            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                              {totalTimeParked} hrs
                            </h3>
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-zinc-500 dark:text-zinc-400">
                                  Utilization
                                </span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                  {utilizationPercentage.toFixed(0)}%
                                </span>
                              </div>
                              <Progress
                                value={utilizationPercentage}
                                className="h-1.5 bg-emerald-100 dark:bg-emerald-900/30"
                                style={
                                  {
                                    "--progress-foreground": isDark
                                      ? "rgb(52 211 153)"
                                      : "rgb(16 185 129)",
                                  } as React.CSSProperties
                                }
                              />
                            </div>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Timer className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants} className="group">
                    <Card className="rounded-xl overflow-hidden border-amber-100 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-zinc-900 group-hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-amber-600/70 dark:text-amber-400/70 flex items-center">
                              <CreditCard className="h-3.5 w-3.5 mr-1" />
                              Total Spent
                            </p>
                            <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                              ₹{Number(totalSpent).toLocaleString()}
                            </h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              On parking services
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Overview Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Monthly Booking History Chart - Replace Recharts with ShadCN UI */}
                  <motion.div variants={itemVariants}>
                    <Card className="rounded-xl py-0 overflow-hidden border-blue-100 dark:border-blue-800/30 shadow-md h-full bg-white dark:bg-zinc-900">
                      <CardHeader className="pt-4 border-b border-blue-100/50 dark:border-blue-800/20 bg-blue-50/60 dark:bg-blue-950/20">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium flex items-center gap-1.5 text-blue-900 dark:text-blue-200">
                            <ChartBar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            Monthly Booking History
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30"
                          >
                            {bookingHistory.length} months
                          </Badge>
                        </div>
                        <CardDescription className="text-blue-700/70 dark:text-blue-400/70">
                          Number of bookings per month
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-5 pt-6">
                        {bookingHistory.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="h-16 w-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                              <Calendar className="h-8 w-8 text-blue-400 dark:text-blue-500" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-[250px]">
                              No booking history available yet. Your activity
                              will show here.
                            </p>
                          </div>
                        ) : (
                          <div className="h-[300px] w-full">
                            {/* ShadCN UI Bar Chart replacement */}
                            <BarChart
                              data={bookingHistory.map((item) => ({
                                name: item.month,
                                value: item.bookings,
                              }))}
                              valueFormatter={(value) => `${value} bookings`}
                              className="h-[300px] "
                              showAnimation={true}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Spending Over Time Chart */}
                  <motion.div variants={itemVariants}>
                    <Card className="py-0 rounded-xl overflow-hidden border-emerald-100 dark:border-emerald-800/30 shadow-md h-full bg-white dark:bg-zinc-900">
                      <CardHeader className="pt-4 pb-2 border-b border-emerald-100/50 dark:border-emerald-800/20 bg-emerald-50/60 dark:bg-emerald-950/20">
                        <div className="flex items-center justify-between">
                          <CardTitle className=" text-lg font-medium flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200">
                            <LineChartIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            Spending Over Time
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30"
                          >
                            ₹{Number(totalSpent).toLocaleString()} total
                          </Badge>
                        </div>
                        <CardDescription className="text-emerald-700/70 dark:text-emerald-400/70">
                          Monthly parking expenses
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-5 pt-6">
                        {!spendingChartFlag ? (
                          <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                              <CreditCard className="h-8 w-8 text-emerald-400 dark:text-emerald-500" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-[250px]">
                              No spending data available yet. Your expenses will
                              be tracked here.
                            </p>
                          </div>
                        ) : (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={spendingData}
                                margin={{
                                  top: 20,
                                  right: 20,
                                  left: 10,
                                  bottom: 10,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorSpending"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="#10b981"
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="#10b981"
                                      stopOpacity={0.1}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke={
                                    isDark
                                      ? "rgba(113, 128, 150, 0.2)"
                                      : "rgba(203, 213, 225, 0.5)"
                                  }
                                  vertical={false}
                                />
                                <XAxis
                                  dataKey="month"
                                  stroke={isDark ? "#94a3b8" : "#64748b"}
                                  tickLine={false}
                                  axisLine={false}
                                  padding={{ left: 10, right: 10 }}
                                />
                                <YAxis
                                  stroke={isDark ? "#94a3b8" : "#64748b"}
                                  tickFormatter={(value) => `₹${value}`}
                                  tickLine={false}
                                  axisLine={false}
                                  width={45}
                                />
                                <Tooltip
                                  content={<CustomTooltip theme={theme} />}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#10b981"
                                  strokeWidth={3}
                                  activeDot={{ r: 6, strokeWidth: 0 }}
                                  dot={{ r: 4, strokeWidth: 0 }}
                                  fill="url(#colorSpending)"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Parking Insights Card */}
                <motion.div variants={itemVariants}>
                  <Card className="py-0 rounded-xl overflow-hidden border-indigo-100 dark:border-indigo-800/30 shadow-md bg-white dark:bg-zinc-900">
                    <CardHeader className="pt-4 pb-2 border-b border-indigo-100/50 dark:border-indigo-800/20 bg-indigo-50/60 dark:bg-indigo-950/20">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200">
                          <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Your Parking Insights
                        </CardTitle>
                      </div>
                      <CardDescription className="text-indigo-700/70 dark:text-indigo-400/70">
                        Summary and tips based on your parking habits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                              Average Duration
                            </span>
                            <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                          </div>
                          <div className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mt-1">
                            {totalBookings > 0
                              ? (totalTimeParked / totalBookings).toFixed(1)
                              : 0}{" "}
                            hrs
                          </div>
                          <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mt-1">
                            Per parking session
                          </p>
                        </div>

                        <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Average Cost
                            </span>
                            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                              <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="text-xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                            ₹
                            {totalBookings > 0
                              ? (totalSpent / totalBookings).toFixed(2)
                              : "0.00"}
                          </div>
                          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                            Per parking session
                          </p>
                        </div>

                        <div className="bg-violet-50/50 dark:bg-violet-950/20 rounded-xl p-4 border border-violet-100 dark:border-violet-800/30 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                              Most Active Period
                            </span>
                            <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </div>
                          </div>
                          <div className="text-xl font-bold text-violet-900 dark:text-violet-200 mt-1">
                            {mostActiveMonth}
                          </div>
                          <p className="text-xs text-violet-600/70 dark:text-violet-400/70 mt-1">
                            Month with most bookings
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Activity Tab Content */}
              <TabsContent
                value="activity"
                className="mt-0 space-y-6 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
              >
                {/* Activity Header */}
                <motion.div variants={itemVariants}>
                  <Card className="border-blue-100 dark:border-blue-800/30 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span>Parking Activity Analysis</span>
                      </CardTitle>
                      <CardDescription>
                        Detailed breakdown of your parking habits and patterns
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Time Spent Distribution */}
                  <motion.div variants={itemVariants}>
                    <Card className="py-0 rounded-xl overflow-hidden border-violet-100 dark:border-violet-800/30 shadow-md h-full bg-white dark:bg-zinc-900">
                      <CardHeader className="pt-4 pb-2 border-b border-violet-100/50 dark:border-violet-800/20 bg-violet-50/60 dark:bg-violet-950/20">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium flex items-center gap-1.5 text-violet-900 dark:text-violet-200">
                            <PieChartIcon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            Time Spent in Parking
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/30"
                          >
                            {timeSpentData.length} categories
                          </Badge>
                        </div>
                        <CardDescription className="text-violet-700/70 dark:text-violet-400/70">
                          Distribution of parking durations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-5 pt-6">
                        {!pieChartFlag ? (
                          <div className="flex flex-col items-center justify-center py-12 space-y-3">
                            <div className="h-16 w-16 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
                              <TimerOff className="h-8 w-8 text-violet-400 dark:text-violet-500" />
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-[250px]">
                              No time spent data available yet. Your parking
                              durations will appear here.
                            </p>
                          </div>
                        ) : (
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={timeSpentData}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={100}
                                  innerRadius={60}
                                  paddingAngle={3}
                                  label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                  }
                                  labelLine={{
                                    stroke: isDark ? "#94a3b8" : "#64748b",
                                    strokeWidth: 1,
                                  }}
                                >
                                  {timeSpentData.map((_entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                      stroke={isDark ? "#1f2937" : "#ffffff"}
                                      strokeWidth={2}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  content={<CustomTooltip theme={theme} />}
                                />
                                <Legend
                                  verticalAlign="bottom"
                                  align="center"
                                  layout="horizontal"
                                  iconSize={10}
                                  iconType="circle"
                                  wrapperStyle={{
                                    fontSize: "12px",
                                    paddingTop: "10px",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Activity Summary and Tips */}
                  <motion.div variants={itemVariants}>
                    <Card className="pt-0 rounded-xl overflow-hidden border-indigo-100 dark:border-indigo-800/30 shadow-md h-full bg-white dark:bg-zinc-900">
                      <CardHeader className="pt-4 pb-2 border-b border-indigo-100/50 dark:border-indigo-800/20 bg-indigo-50/60 dark:bg-indigo-950/20">
                        <CardTitle className="text-lg font-medium flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200">
                          <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          Parking Behavior & Tips
                        </CardTitle>
                        <CardDescription className="text-indigo-700/70 dark:text-indigo-400/70">
                          Analysis and recommendations based on your usage
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-5">
                        <div className="space-y-5">
                          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/70 to-blue-50/70 dark:from-indigo-950/30 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-800/30">
                            <h3 className="text-sm font-medium text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5 mb-3">
                              <CircleDot className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                              Activity Summary
                            </h3>
                            <ScrollArea className="h-[90px] pr-4">
                              {totalBookings > 0 ? (
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                  You've made {totalBookings} parking{" "}
                                  {totalBookings === 1
                                    ? "reservation"
                                    : "reservations"}{" "}
                                  and spent a total of {totalTimeParked} hours
                                  parked across various locations. Your most
                                  active month was{" "}
                                  {mostActiveMonth}
                                  {timeSpentData.length > 0 &&
                                    ` Most of your parkings lasted between ${timeSpentData[0].name}.`}
                                </p>
                              ) : (
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                  No parking activity recorded yet. Once you
                                  make your first reservation, you'll see a
                                  summary of your parking habits here.
                                </p>
                              )}
                            </ScrollArea>
                          </div>

                          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-50/70 to-purple-50/70 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-100 dark:border-violet-800/30">
                            <h3 className="text-sm font-medium text-violet-900 dark:text-violet-200 flex items-center gap-1.5 mb-3">
                              <CircleDot className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                              Parking Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-violet-700 dark:text-violet-300">
                              <li className="flex items-start gap-1.5">
                                <div className="mt-0.5 min-w-4">•</div>
                                <div>
                                  Book in advance to secure preferred spots
                                  during peak times
                                </div>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <div className="mt-0.5 min-w-4">•</div>
                                <div>
                                  Check for off-peak discounts to save on
                                  regular parking
                                </div>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <div className="mt-0.5 min-w-4">•</div>
                                <div>
                                  Consider monthly passes if you park frequently
                                </div>
                              </li>
                            </ul>
                          </div>

                          <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/30 bg-emerald-50/40 dark:bg-emerald-950/10">
                            <h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-3">
                              <CircleDot className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              Potential Savings
                            </h3>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                              {totalBookings > 2 ? (
                                <>
                                  Based on your usage patterns, you could save
                                  approximately ₹
                                  {(totalSpent * 0.15).toFixed(2)} by booking
                                  during off-peak hours or using discount
                                  packages.
                                </>
                              ) : (
                                <>
                                  Not enough booking history to calculate
                                  potential savings. Continue using our services
                                  to receive personalized recommendations.
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>

      {/* Footer information */}
      <motion.div variants={itemVariants} className="pt-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          Last updated: {new Date().toLocaleString()} • Data refreshes
          automatically every session
        </p>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;