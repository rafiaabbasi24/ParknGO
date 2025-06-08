import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InVehicle from "./InVehicle";
import OutVehicle from "./OutVehicle";
import History from "./History";
import { motion } from "framer-motion";

// Icons
import { Car, LogOut, History as HistoryIcon, ParkingCircle } from "lucide-react";

const ManageVehicle = () => {
  const [activeTab, setActiveTab] = useState("in");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="p-6 min-h-screen bg-background text-foreground transition-colors"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Header Section */}
      <motion.div 
        className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 shadow-xl transition-all duration-300"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100 dark:bg-teal-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-teal-200/30 to-emerald-200/30 dark:from-teal-800/10 dark:to-emerald-800/10 blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-emerald-200 dark:border-emerald-800/30 shadow-sm backdrop-blur-sm">
              <ParkingCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-200">
                Vehicle Management
              </h1>
              <p className="text-emerald-900/70 dark:text-emerald-300/70 mt-1 font-medium max-w-2xl">
                Track and manage vehicles at different stages in your parking system
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="overflow-hidden bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center bg-gradient-to-r from-zinc-50/80 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800">
            <TabsList className="h-16 bg-transparent rounded-none border-0 p-0 relative">
              <TabsTrigger
                value="in"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-emerald-700 dark:data-[state=active]:text-emerald-400 transition-all gap-2 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <Car className="h-4 w-4" />
                <span>Upcoming Vehicles</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 dark:bg-emerald-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
              <TabsTrigger
                value="out"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-amber-700 dark:data-[state=active]:text-amber-400 transition-all gap-2 hover:text-amber-600 dark:hover:text-amber-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Parked Vehicles</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 dark:bg-amber-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <HistoryIcon className="h-4 w-4" />
                <span>History</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-0 bg-gradient-to-b from-white to-zinc-50/50 dark:from-black dark:to-zinc-900/50">
            <TabsContent 
              value="in" 
              className="m-0 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
            >
              <InVehicle />
            </TabsContent>
            <TabsContent 
              value="out" 
              className="m-0 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
            >
              <OutVehicle />
            </TabsContent>
            <TabsContent 
              value="history" 
              className="m-0 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
            >
              <History />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Feature Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {/*
          {
            title: "Live Tracking",
            description: "Track vehicles in real-time at every stage of the parking process",
            color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800/30",
            icon: <Car className="h-5 w-5" />,
            iconBg: "bg-emerald-100 dark:bg-emerald-800/30"
          },
          {
            title: "Detailed Records",
            description: "Maintain comprehensive records of all parking transactions",
            color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800/30",
            icon: <LogOut className="h-5 w-5" />,
            iconBg: "bg-amber-100 dark:bg-amber-800/30"
          },
          {
            title: "Organized History",
            description: "Access and export historical data with a single click",
            color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800/30",
            icon: <HistoryIcon className="h-5 w-5" />,
            iconBg: "bg-blue-100 dark:bg-blue-800/30"
          }
        */}
      </motion.div>
    </motion.div>
  );
};

export default ManageVehicle;
