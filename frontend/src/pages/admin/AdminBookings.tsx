import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";
import { toast } from "react-hot-toast";
import { ParkingCardSlider } from "@/components/admin/ParkingCardSlider";
import { motion } from "framer-motion";

// UI Components
import { Card, CardContent } from "@/components/ui/card";

// Icons
import { Map, MapPin, Calendar, ParkingCircle } from "lucide-react";

interface ParkingSpot {
  id: number;
  image: string;
  location: string;
  availableSlot: number;
  totalSlot: number;
  price: string;
}

const AdminBookings = () => {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLocations: 0,
    totalSlots: 0,
    availableSlots: 0,
  });

  // Fetch parking data from API
  useEffect(() => {
    const fetchParkingSpots = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("adminToken");
        if (!token) {
          toast.error("Admin token not found");
          return;
        }

        const res = await axios.get(`${BACKEND_URL}/api/user/getParkings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformed = res.data.map((lot: any) => ({
          id: lot.id,
          image: lot.imgUrl,
          location: lot.location,
          availableSlot: lot.totalSlot - lot.bookedSlot,
          totalSlot: lot.totalSlot,
          price: `₹${lot.price}/hr`,
        }));

        setParkingSpots(transformed);

        // Calculate stats
        const totalSlots = transformed.reduce(
          (acc: any, spot: any) => acc + spot.totalSlot,
          0
        );
        const availableSlots = transformed.reduce(
          (acc: any, spot: any) => acc + spot.availableSlot,
          0
        );

        setStats({
          totalLocations: transformed.length,
          totalSlots,
          availableSlots,
        });
      } catch (error) {
        console.error("Failed to fetch parking spots:", error);
        toast.error("Failed to load parking locations");
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSpots();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
      className="p-6 bg-background text-foreground"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Premium Header with Gradient Background */}
      <motion.div
        className="relative mb-8 p-6 rounded-2xl overflow-hidden bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/20 shadow-xl"
        variants={itemVariants}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-full -ml-16 -mb-16 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-800/10 dark:to-indigo-800/10 blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-blue-200 dark:border-blue-800/30 shadow-sm backdrop-blur-sm">
                  <ParkingCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-200">
                  Parking Locations
                </h1>
              </div>
              <p className="text-blue-900/70 dark:text-blue-300/70 font-medium ml-1">
                Book parking slots across different locations for your customers
              </p>
            </div>

            {/* Enhanced Stats with Animation */}
            {!loading && (
              <div className="flex gap-3 flex-wrap">
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 dark:border-blue-800/30 shadow-sm flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Map className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalLocations}
                    </span>
                    <p className="text-xs text-blue-700/70 dark:text-blue-400/70 font-medium">
                      Locations
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg p-3 border border-purple-100 dark:border-purple-800/30 shadow-sm flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {stats.totalSlots}
                    </span>
                    <p className="text-xs text-purple-700/70 dark:text-purple-400/70 font-medium">
                      Total Slots
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-lg p-3 border border-emerald-100 dark:border-emerald-800/30 shadow-sm flex items-center gap-3"
                >
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {stats.availableSlots}
                    </span>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 font-medium">
                      Available
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content - Enhanced Card with Subtle Shadow and Better Spacing */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <ParkingCardSlider parkingSpots={parkingSpots} loading={loading} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminBookings;
