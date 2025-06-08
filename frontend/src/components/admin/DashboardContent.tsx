import React, { useState, useEffect, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/utils/backend";
import { ThemeContext } from "@/context/ThemeContext";

// shadcn components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// icons
import {
  CircleDot,
  TrendingUp,
  Car,
  Calendar,
  ParkingCircle,
  LogOut,
  History,
  CircleDollarSign,
} from "lucide-react";

import { Skeleton } from "../ui/skeleton";

interface DashboardStats {
  totalParkingLots: number;
  totalBookings: number;
  totalVehiclesIn: number;
  totalVehiclesOut: number;
  totalVehiclesHistory: number;
}

interface OccupancyDataItem {
  name: string;
  value: number;
}

interface TrendDataItem {
  date: string;
  in: number;
  out: number;
  history: number;
}

interface EarningsDataItem {
  month: string;
  earnings: number;
}

interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DashboardContent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalParkingLots: 0,
    totalBookings: 0,
    totalVehiclesIn: 0,
    totalVehiclesOut: 0,
    totalVehiclesHistory: 0,
  });
  const { theme } = useContext(ThemeContext);
  const [occupancyData, setOccupancyData] = useState<OccupancyDataItem[]>([]);
  const [trendData, setTrendData] = useState<TrendDataItem[]>([]);
  const [earningsData, setEarningsData] = useState<EarningsDataItem[]>([]);
  const [formattedEarningsData, setFormattedEarningsData] = useState<
    BarChartData[]
  >([]);
  // Add state for active tab
  const [activeTab, setActiveTab] = useState("overview");

  // Modern color palette
  const pieColors = ["#6366F1", "#F97316", "#06B6D4"];
  const lineColors = {
    in: "#8B5CF6",
    out: "#EC4899",
    history: "#10B981",
  };
  const barColor = "#0EA5E9";

  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (!token) {
      toast.error("Admin token not found");
      return;
    }

    const fetchAll = async () => {
      try {
        const [statsRes, occupancyRes, trendsRes, earningsRes] =
          await Promise.all([
            axios.get(`${BACKEND_URL}/api/admin/dashboard/stats`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/api/admin/dashboard/occupancy`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/api/admin/dashboard/trends`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/api/admin/dashboard/earnings`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setStats(statsRes.data);
        setOccupancyData(occupancyRes.data);
        setTrendData(trendsRes.data);
        setEarningsData(earningsRes.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Add a new useEffect to transform earnings data for ShadCN BarList
  useEffect(() => {
    if (earningsData.length > 0) {
      const formatted = earningsData.map((item) => ({
        name: monthTickFormatter(item.month),
        value: item.earnings,
        color: barColor,
      }));
      setFormattedEarningsData(formatted);
    }
  }, [earningsData]);

  const monthTickFormatter = (value: string) => {
    const parts = value.split("-");
    if (parts.length === 2) {
      const monthIndex = parseInt(parts[1], 10) - 1;
      return monthNames[monthIndex];
    }
    return value;
  };

  const formatDateToDDMMYYYY = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // Card data with icons and enhanced styling
  const summaryCards = [
    {
      title: "Parking Lots",
      value: stats.totalParkingLots,
      icon: <ParkingCircle className="h-6 w-6" />,
      gradient: "from-blue-500/20 to-blue-600/20",
      color: "text-blue-500",
      borderColor: "border-blue-500/20",
      shadow: "shadow-blue-500/10",
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: <Calendar className="h-6 w-6" />,
      gradient: "from-purple-500/20 to-purple-600/20",
      color: "text-purple-500",
      borderColor: "border-purple-500/20",
      shadow: "shadow-purple-500/10",
    },
    {
      title: "Vehicles In",
      value: stats.totalVehiclesIn,
      icon: <Car className="h-6 w-6" />,
      gradient: "from-emerald-500/20 to-emerald-600/20",
      color: "text-emerald-500",
      borderColor: "border-emerald-500/20",
      shadow: "shadow-emerald-500/10",
    },
    {
      title: "Vehicles Out",
      value: stats.totalVehiclesOut,
      icon: <LogOut className="h-6 w-6" />,
      gradient: "from-amber-500/20 to-amber-600/20",
      color: "text-amber-500",
      borderColor: "border-amber-500/20",
      shadow: "shadow-amber-500/10",
    },
    {
      title: "History",
      value: stats.totalVehiclesHistory,
      icon: <History className="h-6 w-6" />,
      gradient: "from-rose-500/20 to-rose-600/20",
      color: "text-rose-500",
      borderColor: "border-rose-500/20",
      shadow: "shadow-rose-500/10",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border rounded-lg shadow-lg">
          <p className="font-medium text-sm">{formatDateToDDMMYYYY(label)}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div
                key={`tooltip-${index}`}
                className="flex items-center text-sm"
              >
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{entry.name}:</span>
                <span className="ml-1">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors">
      {/* Modern Dashboard Header */}
      <div className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-indigo-950/30 shadow-xl transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-indigo-950 dark:text-indigo-200">
                Admin Dashboard
              </h1>
              <p className="text-indigo-900/70 dark:text-indigo-300/70 mt-1 font-medium">
                Overview of your parking management system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/80 dark:bg-zinc-800/80 rounded-lg shadow-sm p-2 flex items-center gap-2 border border-indigo-100 dark:border-indigo-500/20 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-sm">
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    Today
                  </p>
                  <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-zinc-800/80 rounded-lg shadow-sm p-2 flex items-center gap-2 border border-emerald-100 dark:border-emerald-500/20 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-md bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <CircleDollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-sm">
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    System
                  </p>
                  <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {summaryCards.map((item, index) => (
          <Card
            key={index}
            className={`border ${item.borderColor} ${item.shadow} overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
          >
            {loading ? (
              <CardContent className="p-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            ) : (
              <>
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-70`}
                />
                <div className="absolute top-0 right-0 h-16 w-16 transform translate-x-6 -translate-y-6">
                  <div
                    className={`w-full h-full rounded-full ${item.gradient} opacity-20`}
                  />
                </div>
                <CardContent className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`${item.color} p-2 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow-sm border border-white/50 dark:border-zinc-700/50`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-muted-foreground">
                        Total
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </p>
                    <p className={`text-3xl font-bold ${item.color}`}>
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Analytics Tabs Section */}
      <div className="mt-8 mb-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-zinc-900/50 dark:to-indigo-950/10 p-6 rounded-xl border border-blue-100/50 dark:border-indigo-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-indigo-950 dark:text-indigo-200">
              Dashboard Analytics
            </h2>
            <p className="text-indigo-900/70 dark:text-indigo-300/70 mt-1">
              Comprehensive view of your parking system analytics
            </p>
          </div>
        </div>
      </div>

      {/* Improved Tabbed Content */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pt-1 pb-3 -mt-1">
          <TabsList className="bg-white/80 dark:bg-zinc-800/80 border border-indigo-100 dark:border-indigo-900/30 p-1 h-auto rounded-lg mx-auto w-fit">
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-layout-dashboard"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1" />
                  <rect width="7" height="5" x="14" y="3" rx="1" />
                  <rect width="7" height="9" x="14" y="12" rx="1" />
                  <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                <span>Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="occupancy"
              className="rounded-md data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <CircleDot className="h-4 w-4" />
                <span>Occupancy</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="rounded-md data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trends</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="revenue"
              className="rounded-md data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-400 data-[state=active]:shadow-sm px-4 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4" />
                <span>Revenue</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab Content */}
        <TabsContent
          value="overview"
          className="mt-2 space-y-6 animate-in fade-in-50 duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Parking Lot Occupancy Distribution</CardTitle>
                  <CardDescription>
                    Current distribution by status
                  </CardDescription>
                </div>
                <CircleDot className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="flex flex-col items-center space-y-4 py-12">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                ) : (
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={occupancyData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={80}
                          paddingAngle={6}
                          cornerRadius={6}
                          label={false}
                          labelLine={false}
                          animationDuration={1500}
                          animationEasing="ease-in-out"
                          className="drop-shadow-md"
                        >
                          {occupancyData.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={pieColors[index % pieColors.length]}
                              strokeWidth={0}
                              className="transition-opacity duration-300 hover:opacity-80"
                            />
                          ))}
                        </Pie>
                        <Legend
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{
                            paddingTop: 30,
                            fontFamily: "var(--font-sans)",
                            fontSize: "14px",
                          }}
                          formatter={(value, _entry, index) => (
                            <div className="flex flex-col items-center">
                              <span className="font-medium text-sm">{value}</span>
                              <span className="text-xs text-muted-foreground">
                                {occupancyData[index]?.value || 0} parking lot (
                                {(
                                  ((occupancyData[index]?.value || 0) /
                                    occupancyData.reduce(
                                      (acc, item) => acc + item.value,
                                      0
                                    )) *
                                  100
                                ).toFixed(0)}
                                %)
                              </span>
                            </div>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Vehicle Trends Over Time</CardTitle>
                  <CardDescription>
                    Daily trends of vehicle status changes
                  </CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="space-y-4 py-12">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme === "dark" ? "#333" : "#eee"}
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDateToDDMMYYYY}
                          tick={{ fontSize: 12 }}
                          stroke="currentColor"
                          opacity={0.6}
                        />
                        <YAxis
                          stroke="currentColor"
                          opacity={0.6}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            paddingTop: 20,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="in"
                          name="Upcoming"
                          stroke={lineColors.in}
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            strokeWidth: 0,
                            fill: lineColors.in,
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="out"
                          name="Parked"
                          stroke={lineColors.out}
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            strokeWidth: 0,
                            fill: lineColors.out,
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="history"
                          name="Settled"
                          stroke={lineColors.history}
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            strokeWidth: 0,
                            fill: lineColors.history,
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bar Chart - Full Width */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Monthly Revenue Analytics</CardTitle>
                  <CardDescription>
                    Total earnings breakdown by month
                  </CardDescription>
                </div>
                <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="space-y-4 py-12">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <div className="h-[350px] w-full">
                    <BarChart
                      data={formattedEarningsData}
                      valueFormatter={(value) => `₹${value.toLocaleString()}`}
                      showAnimation={true}
                      color={barColor}
                      onClick={(item) => {
                        toast.success(
                          `${item.name}: ₹${item.value.toLocaleString()}`
                        );
                      }}
                      className="h-full"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Occupancy Tab Content */}
        <TabsContent
          value="occupancy"
          className="mt-2 animate-in fade-in-50 duration-300"
        >
          <div className="grid grid-cols-1 gap-6">
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Vehicle Occupancy Distribution</CardTitle>
                  <CardDescription>
                    Current distribution of vehicles by status
                  </CardDescription>
                </div>
                <CircleDot className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="flex flex-col items-center space-y-4 py-12">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                ) : (
                  <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={occupancyData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          innerRadius={100}
                          paddingAngle={6}
                          cornerRadius={6}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          labelLine={true}
                          animationDuration={1500}
                          animationEasing="ease-in-out"
                          className="drop-shadow-md"
                        >
                          {occupancyData.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={pieColors[index % pieColors.length]}
                              strokeWidth={0}
                              className="transition-opacity duration-300 hover:opacity-80"
                            />
                          ))}
                        </Pie>
                        <Legend
                          layout="horizontal"
                          align="center"
                          verticalAlign="bottom"
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{
                            paddingTop: 30,
                            fontFamily: "var(--font-sans)",
                            fontSize: "14px",
                          }}
                          formatter={(value, _entry, index) => (
                            <div className="flex flex-col items-center">
                              <span className="font-medium text-sm">{value}</span>
                              <span className="text-xs text-muted-foreground">
                                {occupancyData[index]?.value || 0} vehicles (
                                {(
                                  ((occupancyData[index]?.value || 0) /
                                    occupancyData.reduce(
                                      (acc, item) => acc + item.value,
                                      0
                                    )) *
                                  100
                                ).toFixed(0)}
                                %)
                              </span>
                            </div>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Occupancy Details Table for Extra Context */}
            {!loading && (
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Occupancy Breakdown</CardTitle>
                  <CardDescription>
                    Detailed view of current vehicle status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Count</th>
                          <th className="px-4 py-3 text-left font-medium">
                            Percentage
                          </th>
                          <th className="px-4 py-3 text-left font-medium">
                            Indicator
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {occupancyData.map((item, index) => {
                          const percentage = (
                            (item.value / occupancyData.reduce(
                              (acc, i) => acc + i.value,
                              0
                            )) *
                            100
                          ).toFixed(1);

                          return (
                            <tr
                              key={index}
                              className="border-t border-zinc-200 dark:border-zinc-800"
                            >
                              <td className="px-4 py-3 font-medium">{item.name}</td>
                              <td className="px-4 py-3">{item.value}</td>
                              <td className="px-4 py-3">{percentage}%</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                      backgroundColor:
                                        pieColors[index % pieColors.length],
                                    }}
                                  />
                                  <div className="w-24 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${percentage}%`,
                                        backgroundColor:
                                          pieColors[index % pieColors.length],
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Trends Tab Content */}
        <TabsContent
          value="trends"
          className="mt-2 animate-in fade-in-50 duration-300"
        >
          <div className="grid grid-cols-1 gap-6">
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Vehicle Trends Over Time</CardTitle>
                  <CardDescription>
                    Daily trends of vehicle status changes
                  </CardDescription>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                {loading ? (
                  <div className="space-y-4 py-12">
                    <Skeleton className="h-[400px] w-full" />
                  </div>
                ) : (
                  <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme === "dark" ? "#333" : "#eee"}
                        />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDateToDDMMYYYY}
                          tick={{ fontSize: 12 }}
                          stroke="currentColor"
                          opacity={0.6}
                        />
                        <YAxis
                          stroke="currentColor"
                          opacity={0.6}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{
                            paddingTop: 20,
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="in"
                          name="Upcoming"
                          stroke={lineColors.in}
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            strokeWidth: 0,
                            fill: lineColors.in,
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="out"
                          name="Parked"
                          stroke={lineColors.out}
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            strokeWidth: 0,
                            fill: lineColors.out,
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="history"
                          name="Settled"
                          stroke={lineColors.history}
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            strokeWidth: 0,
                            fill: lineColors.history,
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trend Analysis Summary Card */}
            {!loading && trendData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Upcoming Vehicles",
                    dataKey: "in",
                    icon: <Car className="h-5 w-5" />,
                    color: lineColors.in,
                    bgColor: "bg-purple-50 dark:bg-purple-900/20",
                  },
                  {
                    title: "Parked Vehicles",
                    dataKey: "out",
                    icon: <ParkingCircle className="h-5 w-5" />,
                    color: lineColors.out,
                    bgColor: "bg-pink-50 dark:bg-pink-900/20",
                  },
                  {
                    title: "Settled Vehicles",
                    dataKey: "history",
                    icon: <History className="h-5 w-5" />,
                    color: lineColors.history,
                    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
                  },
                ].map((item, index) => {
                  const currentTotal = trendData.reduce(
                    (sum, dataPoint) =>
                      sum + (dataPoint[item.dataKey as keyof TrendDataItem] as number),
                    0
                  );
                  const avgPerDay = (currentTotal / trendData.length).toFixed(1);

                  // We're commenting out these unused variables to avoid TypeScript warnings
                  // If needed for future growth calculations, uncomment them
                  // const latestDataPoint = trendData[trendData.length - 1][
                  //   item.dataKey as keyof TrendDataItem
                  // ] as number;
                                    
                  // const previousDataPoint =
                  //   trendData[trendData.length - 2]?.[
                  //     item.dataKey as keyof TrendDataItem
                  //   ] as number || 0;
                  
                                    return (
                                      <Card key={index} className={`border ${item.bgColor}`}>
                                        <CardContent className="pt-6">
                                          <div className="flex items-center justify-between mb-4">
                                            <div
                                              className="p-2 rounded-lg"
                                              style={{ color: item.color }}
                                            >
                                              {item.icon}
                                            </div>
                                            <div
                                              className="text-xs font-medium px-2 py-1 rounded-full"
                                              style={{
                                                backgroundColor: item.color + "20",
                                                color: item.color,
                                              }}
                                            >
                                              {avgPerDay} avg/day
                                            </div>
                                          </div>
                                          <h3 className="font-medium text-sm text-muted-foreground">
                                            {item.title}
                                          </h3>
                                          <div className="text-2xl font-bold mt-1" style={{ color: item.color }}>
                                            {currentTotal}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </TabsContent>
                  
                          {/* Revenue Tab Content */}
                          <TabsContent
                            value="revenue"
                            className="mt-2 animate-in fade-in-50 duration-300"
                          >
                            <div className="grid grid-cols-1 gap-6">
                              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                  <div>
                                    <CardTitle>Monthly Revenue Analytics</CardTitle>
                                    <CardDescription>
                                      Total earnings breakdown by month
                                    </CardDescription>
                                  </div>
                                  <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="pt-0">
                                  {loading ? (
                                    <div className="space-y-4 py-12">
                                      <Skeleton className="h-[400px] w-full" />
                                    </div>
                                  ) : (
                                    <div className="h-[500px] w-full">
                                      <BarChart
                                        data={formattedEarningsData}
                                        valueFormatter={(value) => `₹${value.toLocaleString()}`}
                                        showAnimation={true}
                                        color={barColor}
                                        className="h-full"
                                      />
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                  
                              {/* Revenue Summary */}
                              {!loading && earningsData.length > 0 && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Revenue Insights</CardTitle>
                                    <CardDescription>
                                      Key metrics based on earnings data
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            Total Revenue
                                          </h3>
                                          <CircleDollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                          ₹
                                          {earningsData
                                            .reduce((sum, item) => sum + item.earnings, 0)
                                            .toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                          <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                            Average Monthly
                                          </h3>
                                          <CircleDollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                          ₹
                                          {(
                                            earningsData.reduce((sum, item) => sum + item.earnings, 0) /
                                            Math.max(earningsData.length, 1)
                                          ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </p>
                                      </div>
                                      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                                        <div className="flex items-center justify-between mb-3">
                                          <h3 className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                            Highest Month
                                          </h3>
                                          <CircleDollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                                          ₹
                                          {Math.max(
                                            ...earningsData.map((item) => item.earnings)
                                          ).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    );
                  };
                  
                  export default DashboardContent;
