import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AddCategory from "./AddCategory";
import ManageCategory from "./ManageCategory";

// UI Components
import { Card, CardContent } from "@/components/ui/card";

// Icons
import { Plus, List, CarFront, Tag } from "lucide-react";

const VehicleCategory = () => {
  const [activeTab, setActiveTab] = useState("manage");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCategoryAdded = () => {
    // Switch to manage tab and toggle refresh trigger
    setActiveTab("manage");
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors">
      {/* Premium Header Section */}
      <div className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 shadow-xl transition-all duration-300">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-100 dark:bg-violet-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-violet-200/30 to-purple-200/30 dark:from-violet-800/10 dark:to-purple-800/10 blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-violet-200 dark:border-violet-800/30 shadow-sm backdrop-blur-sm">
              <CarFront className="h-7 w-7 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-violet-950 dark:text-violet-200 flex items-center gap-2">
                Vehicle Categories
              </h1>
              <p className="text-violet-900/70 dark:text-violet-300/70 mt-1 font-medium max-w-2xl">
                Create and manage vehicle categories for your parking system with
                intuitive controls
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Animated Tabs */}
      <Card className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-center border-b border-zinc-200 dark:border-zinc-800 px-2 bg-gradient-to-r from-zinc-50/80 to-zinc-100/80 dark:from-zinc-900/80 dark:to-zinc-800/80">
              <TabsList className="h-14 bg-transparent rounded-none border-0 p-0">
                <TabsTrigger
                  value="manage"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 dark:data-[state=active]:border-violet-500 rounded-none border-0 h-full px-8 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 transition-all gap-2 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <List className="h-4 w-4" />
                  Manage Categories
                </TabsTrigger>
                <TabsTrigger
                  value="add"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-violet-600 dark:data-[state=active]:border-violet-500 rounded-none border-0 h-full px-8 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium text-zinc-500 dark:text-zinc-400 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 transition-all gap-2 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Category
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6 bg-gradient-to-b from-white to-zinc-50/50 dark:from-black dark:to-zinc-900/50">
              <TabsContent
                value="manage"
                className="m-0 mt-2 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
              >
                <ManageCategory key={refreshTrigger} />
              </TabsContent>
              <TabsContent
                value="add"
                className="m-0 mt-2 animate-in fade-in-50 duration-300 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:duration-150"
              >
                <AddCategory onCategoryAdded={handleCategoryAdded} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: <Tag className="h-5 w-5" />,
            title: "Flexible Categories",
            description:
              "Create custom categories to match your specific vehicle types",
            color:
              "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800/30",
            iconBg: "bg-violet-100 dark:bg-violet-900/30",
          },
          {
            icon: <CarFront className="h-5 w-5" />,
            title: "Vehicle Management",
            description:
              "Organize vehicles efficiently for better parking management",
            color:
              "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/30",
            iconBg: "bg-purple-100 dark:bg-purple-900/30",
          },
          {
            icon: (
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
                <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
                <path d="M6 9v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9" />
                <path d="M4 7h16" />
                <path d="M9 9v12" />
                <path d="M15 9v12" />
              </svg>
            ),
            title: "Premium Experience",
            description:
              "Enjoy a modern interface with smooth animations and user-friendly design",
            color:
              "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30",
            iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`${item.color} p-4 rounded-xl border shadow-sm flex items-start gap-3 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className={`p-2.5 rounded-lg ${item.iconBg}`}>{item.icon}</div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleCategory;
