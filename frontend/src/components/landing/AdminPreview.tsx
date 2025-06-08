import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// Icons
import {
  BarChart3,
  Users,
  MapPin,
  PieChart,
  Settings,
  CheckCircle,
} from "lucide-react";

const AdminPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <BarChart3 className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: "Real-time Analytics",
      description:
        "Monitor parking space usage and revenue in real-time with comprehensive analytics dashboards.",
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: "User Management",
      description:
        "Easily manage user accounts, bookings, and permissions from a central dashboard.",
    },
    {
      icon: <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: "Location Control",
      description:
        "Add, modify, and manage parking locations, spots, and availability status.",
    },
    {
      icon: <PieChart className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: "Revenue Reporting",
      description:
        "Generate detailed revenue reports, with options to export data for accounting purposes.",
    },
    {
      icon: <Settings className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      title: "System Configuration",
      description:
        "Customize system settings, pricing models, and user permissions to fit your needs.",
    },
  ];

  return (
    <section ref={ref} className="py-20 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Dashboard Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-3xl blur-xl"></div>
            <div className="relative overflow-hidden border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl bg-white dark:bg-zinc-900">
              {/* Top bar */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  ParkNGo Admin Dashboard
                </div>
                <div className="w-20"></div>
              </div>

              {/* Dashboard content */}
              <div className="p-4">
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    {
                      label: "Today's Bookings",
                      value: "156",
                      color:
                        "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
                    },
                    {
                      label: "Available Spaces",
                      value: "43",
                      color:
                        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
                    },
                    {
                      label: "Revenue",
                      value: "₹12,450",
                      color:
                        "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className={`${stat.color} rounded-xl border border-zinc-100 dark:border-zinc-800 p-4 flex flex-col justify-center items-center`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                    >
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="text-xs">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart */}
                <motion.div
                  className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 mb-4 border border-zinc-100 dark:border-zinc-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      Parking Usage Analytics
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Last 7 days
                    </div>
                  </div>

                  {/* Bar Chart Container */}
                  <div className="h-40 flex justify-evenly w-full gap-3">
                    {[35, 45, 30, 60, 75, 50, 65].map((height, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-end h-full"
                      >
                        <div
                          className="w-6 rounded-t bg-blue-500 dark:bg-blue-400 transition-all duration-300"
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {["M", "T", "W", "T", "F", "S", "S"][index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent bookings */}
                <motion.div
                  className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4 border border-zinc-100 dark:border-zinc-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="text-sm font-medium mb-3 text-zinc-800 dark:text-zinc-200">
                    Recent Bookings
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        user: "Amit Sharma",
                        location: "Central Plaza, A12",
                        time: "10:30 AM",
                        status: "Active",
                      },
                      {
                        user: "Priya Patel",
                        location: "Market Square, B04",
                        time: "11:45 AM",
                        status: "Upcoming",
                      },
                      {
                        user: "Rahul Singh",
                        location: "Tech Park, C22",
                        time: "2:15 PM",
                        status: "Completed",
                      },
                    ].map((booking, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-white dark:bg-zinc-900 rounded-md border border-zinc-100 dark:border-zinc-700 text-xs"
                      >
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">
                          {booking.user}
                        </div>
                        <div className="text-zinc-500 dark:text-zinc-400">
                          {booking.location}
                        </div>
                        <div className="text-zinc-500 dark:text-zinc-400">
                          {booking.time}
                        </div>
                        <div
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            booking.status === "Active"
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              : booking.status === "Upcoming"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                              : "bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {booking.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Admin Panel
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              Powerful Tools for <br />
              <span className="text-blue-600 dark:text-blue-400">
                Parking Management
              </span>
            </h2>

            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8">
              Take control of your parking operations with our comprehensive
              admin dashboard. Monitor activity, manage users, and optimize
              revenue with ease.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex gap-3 items-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 rounded-full p-2">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <p>
                Admin accounts include access to all premium features, detailed
                analytics, and priority support.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AdminPreview;
