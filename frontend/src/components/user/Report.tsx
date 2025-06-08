import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import Cookies from "js-cookie";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Import components
import { BookingsTable } from "./report/BookingsTable";
import { ExportActions } from "./report/ExportActions";
import { useReportData } from "./report/useReportData";
import { StatsDisplay } from "./report/StatsDisplay";

// Icons
import {
  History,
  Calendar,
  ClipboardList,
  FileClock,
  Clock,
} from "lucide-react";
import { Separator } from "../ui/separator";

const Report = () => {
  const [profile, setProfile] = useState<any>(null);
  const {
    bookings,
    ongoing,
    upcoming,
    past,
    loading,
    exportCSV,
    exportPDF,
    refresh,
  } = useReportData();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };

    fetchProfile();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
      className="flex flex-col space-y-6 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Header */}
      <motion.div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 shadow-xl border border-blue-100 dark:border-blue-800/30"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full -ml-12 -mb-12 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-800/10 dark:to-indigo-800/10 blur-3xl opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-lg bg-white/70 dark:bg-zinc-900/70 border border-blue-200 dark:border-blue-800/30 shadow-sm backdrop-blur-sm">
                  <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-950 dark:text-blue-200">
                  Booking Reports
                </h1>
              </div>
              <p className="text-blue-700/70 dark:text-blue-300/70 ml-1">
                Track and manage all your parking activities in one place
              </p>
            </div>

            <ExportActions
              onExportCSV={exportCSV}
              onExportPDF={exportPDF}
              onRefresh={refresh}
              disabled={loading || bookings.length === 0}
            />
          </div>

          <Separator className="my-6 bg-blue-200/30 dark:bg-blue-800/30" />

          {/* Stats Summary */}
          <StatsDisplay
            ongoing={ongoing.length}
            upcoming={upcoming.length}
            past={past.length}
            loading={loading}
          />
        </div>
      </motion.div>

      {/* Tabs Container */}
      <motion.div
        variants={itemVariants}
        className="overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <Tabs defaultValue="ongoing" className="w-full">
          {/* Updated tab header to match dashboard style */}
          <div className="flex justify-center border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50/80 via-blue-50/10 to-zinc-50/80 dark:from-zinc-900/80 dark:via-blue-900/10 dark:to-zinc-900/80">
            <TabsList className="h-16 bg-transparent rounded-none border-0 p-0 relative">
              <TabsTrigger
                value="ongoing"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Clock className="h-4 w-4" />
                <span>Ongoing</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>

              <TabsTrigger
                value="upcoming"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Calendar className="h-4 w-4" />
                <span>Upcoming</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>

              <TabsTrigger
                value="past"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <History className="h-4 w-4" />
                <span>Past</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 bg-gradient-to-b from-white to-zinc-50/50 dark:from-zinc-900 dark:to-zinc-900/50">
            <TabsContent
              value="ongoing"
              className="mt-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
            >
              <BookingsTable
                bookings={ongoing}
                loading={loading}
                profile={profile}
                type="ongoing"
                icon={<Clock className="h-5 w-5 text-blue-500" />}
              />
            </TabsContent>

            <TabsContent
              value="upcoming"
              className="mt-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
            >
              <BookingsTable
                bookings={upcoming}
                loading={loading}
                profile={profile}
                type="upcoming"
                icon={<Calendar className="h-5 w-5 text-blue-500" />}
              />
            </TabsContent>

            <TabsContent
              value="past"
              className="mt-0 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
            >
              <BookingsTable
                bookings={past}
                loading={loading}
                profile={profile}
                type="past"
                icon={<FileClock className="h-5 w-5 text-blue-500" />}
              />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Footer with last updated info */}
      <motion.div variants={itemVariants} className="text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Last updated: {new Date().toLocaleString()} •
          <span
            className="text-blue-500 dark:text-blue-400 ml-1 hover:underline cursor-pointer"
            onClick={refresh}
          >
            Refresh data
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Report;
