import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "@/components/admin/Profile";
import ChangePassword from "@/components/admin/ChangePassword";
import { motion } from "framer-motion";
import { useState } from "react";

// Icons
import { UserCircle, KeyRound, Settings, Shield } from "lucide-react";

const AdminSetting = () => {
  const [activeTab, setActiveTab] = useState("profile");

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
      className="p-6 min-h-screen bg-background text-foreground"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Header Section with Gradient */}
      <motion.div
        className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/20 shadow-xl transition-all duration-300"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-100 dark:bg-cyan-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-cyan-200/30 to-blue-200/30 dark:from-cyan-800/10 dark:to-blue-800/10 blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-cyan-200 dark:border-cyan-800/30 shadow-sm backdrop-blur-sm">
              <Settings className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-cyan-950 dark:text-cyan-200">
                Account Settings
              </h1>
              <p className="text-cyan-900/70 dark:text-cyan-300/70 mt-1 font-medium max-w-2xl">
                Manage your profile information and security settings
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modern Tabs with Card Container */}
      <motion.div
        variants={itemVariants}
        className="overflow-hidden bg-white dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center bg-gradient-to-r from-zinc-50/80 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800">
            <TabsList className="h-16 bg-transparent rounded-none border-0 p-0 relative">
              <TabsTrigger
                value="profile"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 transition-all gap-2 hover:text-cyan-600 dark:hover:text-cyan-400"
                onClick={() => setActiveTab("profile")}
              >
                <UserCircle className="h-4 w-4" />
                <span>Admin Profile</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 dark:bg-cyan-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="relative h-full px-8 py-2 bg-transparent rounded-none border-0 data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400 transition-all gap-2 hover:text-cyan-600 dark:hover:text-cyan-400"
                onClick={() => setActiveTab("security")}
              >
                <Shield className="h-4 w-4" />
                <span>Security</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500 dark:bg-cyan-400 transform scale-x-0 transition-transform duration-200 ease-out data-[state=active]:scale-x-100"></div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-0 bg-gradient-to-b from-white to-zinc-50/50 dark:from-black dark:to-zinc-900/50">
            <TabsContent
              value="profile"
              className="m-0 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
            >
              <Profile />
            </TabsContent>
            <TabsContent
              value="security"
              className="m-0 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
            >
              <ChangePassword />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8"
      >
        <div className="bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-800/30 p-4 rounded-xl shadow-sm flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="bg-cyan-100 dark:bg-cyan-800/30 p-2.5 rounded-lg">
            <UserCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Profile Management
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Keep your personal information up to date for better communication
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30 p-4 rounded-xl shadow-sm flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="bg-blue-100 dark:bg-blue-800/30 p-2.5 rounded-lg">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              Security Settings
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Regularly update your password to maintain account security
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminSetting;
