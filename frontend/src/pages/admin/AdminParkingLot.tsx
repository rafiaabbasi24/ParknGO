import { useState } from "react";
import ManageParkingLot from "@/components/admin/ManageParkingLot";
import AddParkingLot from "@/components/admin/AddParkingLot";
import { motion } from "framer-motion";

// ShadCN UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Icons
import { ParkingSquare, Plus, List, MapPin } from "lucide-react";

const AdminParkingLot = () => {
  const [activeTab, setActiveTab] = useState("manage-parking-lot");

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
      className="p-6 min-h-screen bg-background text-foreground transition-colors"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* <motion.div 
        className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 shadow-xl transition-all duration-300"
        variants={itemVariants}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-100 dark:bg-cyan-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-800/10 dark:to-cyan-800/10 blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-blue-200 dark:border-blue-800/30 shadow-sm backdrop-blur-sm">
              <ParkingSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-blue-950 dark:text-blue-200 flex items-center gap-2">
                Parking Locations
              </h1>
              <p className="text-blue-900/70 dark:text-blue-300/70 mt-1 font-medium max-w-2xl">
                Create and manage parking locations for your system with comprehensive controls
              </p>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Main Content with Animated Tabs */}
      <motion.div
        variants={itemVariants}
        className="overflow-hidden bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center bg-gradient-to-r from-zinc-50/80 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800">
            <TabsList className="h-16 bg-transparent rounded-none border-0 p-0 relative">
              <TabsTrigger
                value="manage-parking-lot"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <List className="h-4 w-4" />
                <span>Manage Locations</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
              <TabsTrigger
                value="add-parking-lot"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all gap-2 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Plus className="h-4 w-4" />
                <span>Add Location</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 bg-gradient-to-b from-white to-zinc-50/50 dark:from-black dark:to-zinc-900/50">
            <TabsContent
              value="manage-parking-lot"
              className="m-0 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
            >
              <ManageParkingLot />
            </TabsContent>
            <TabsContent
              value="add-parking-lot"
              className="m-0 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
            >
              <AddParkingLot />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
      >
        <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl shadow-sm flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Location Management
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Easily add and manage various parking locations across your system
            </p>
          </div>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-800/30 p-4 rounded-xl shadow-sm flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="p-2.5 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
            <ParkingSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Slot Configuration
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Configure parking slots and capacities based on location
              requirements
            </p>
          </div>
        </div>
        <div className="bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/30 p-4 rounded-xl shadow-sm flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="p-2.5 rounded-lg bg-sky-100 dark:bg-sky-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Real-time Monitoring
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Track space availability and bookings in real-time for all
              locations
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminParkingLot;
