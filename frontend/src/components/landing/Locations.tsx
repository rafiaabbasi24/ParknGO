import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

// Icons
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Star,
  Car,
  Clock,
  ShieldCheck,
  Building,
} from "lucide-react";

interface LocationsProps {
  currentCityIndex: number;
  setCurrentCityIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Locations = ({
  currentCityIndex,
  setCurrentCityIndex,
}: LocationsProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // --- FIX: Initialize useNavigate ---
  const navigate = useNavigate();
  // ------------------------------------

  const cities = [
    {
      name: "Mumbai",
      image:
        "https://images.pexels.com/photos/2833714/pexels-photo-2833714.jpeg?auto=compress&cs=tinysrgb&w=1200",
      locations: 24,
      rating: 4.8,
      description:
        "Find premium parking across Mumbai's business districts and shopping centers.",
      parkingLots: [
        "Marine Drive Parking Complex",
        "BKC Multi-level Parking",
        "Worli Sea Face Parking",
      ],
      address: "Maharashtra, India",
    },
    {
      name: "Delhi",
      image:
        "https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=1200",
      locations: 32,
      rating: 4.7,
      description:
        "Secure parking in Delhi's busiest areas with real-time availability updates.",
      parkingLots: [
        "Connaught Place Parking",
        "Nehru Place Complex",
        "Rajouri Garden Parking",
      ],
      address: "NCT, India",
    },
    {
      name: "Bangalore",
      image:
        "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=1200",
      locations: 28,
      rating: 4.9,
      description:
        "Tech Park and commercial center parking made simple in Bangalore.",
      parkingLots: [
        "Electronic City Parking",
        "MG Road Central Parking",
        "Whitefield Tech Park",
      ],
      address: "Karnataka, India",
    },
    {
      name: "Hyderabad",
      image: "https://images.pexels.com/photos/831475/pexels-photo-831475.jpeg?auto=compress&cs=tinysrgb&w=1200",
      locations: 18,
      rating: 4.6,
      description:
        "Strategic parking locations near Hyderabad's major tech hubs and markets.",
      parkingLots: [
        "Hitech City Parking Complex",
        "Banjara Hills P3",
        "Jubilee Hills Parking",
      ],
      address: "Telangana, India",
    },
    {
      name: "Pune",
      image: "https://img.freepik.com/free-photo/horizontal-picture-car-parking-underground-garage-interior-with-neon-lights-autocars-parked-buildings-urban-constructions-space-transportation-vehicle-night-city-concept_343059-3077.jpg",
      locations: 15,
      rating: 4.8,
      description:
        "Convenient parking options throughout Pune's educational and IT corridors.",
      parkingLots: [
        "Koregaon Park Plaza",
        "Hinjewadi IT Park",
        "FC Road Smart Parking",
      ],
      address: "Maharashtra, India",
    },
  ];

  const nextCity = () => {
    setCurrentCityIndex((prevIndex) => (prevIndex + 1) % cities.length);
  };

  const prevCity = () => {
    setCurrentCityIndex(
      (prevIndex) => (prevIndex - 1 + cities.length) % cities.length
    );
  };

  return (
    <section id="locations" ref={ref} className="py-24 relative">
      {/* Background with modern gradient and pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/30 dark:from-black dark:to-blue-950/10"></div>
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "40px 40px",
          }}
        ></div>
        <div className="absolute top-20 left-0 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 mb-6">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Our Coverage
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
            Available in Major Cities Across India
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Find and book parking spaces in prime locations in these cities,
            with new locations added regularly.
          </p>
        </motion.div>

        {/* City showcase with interactive card */}
        <div className="relative px-4 md:px-8">
          {/* Navigation buttons */}
          <motion.button
            onClick={prevCity}
            className="absolute left-0 md:-left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-md backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-800 transition-colors"
            aria-label="Previous city"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </motion.button>

          <motion.button
            onClick={nextCity}
            className="absolute right-0 md:-right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-md backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-800 transition-colors"
            aria-label="Next city"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          </motion.button>

          {/* Main featured city card */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCityIndex}
                className="w-full"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, type: "tween",ease: "easeInOut" }}
              >
                <div className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* City image with overlay */}
                    <div className="relative h-[250px] md:h-[450px]">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-10 dark:opacity-20"></div>
                      <img
                        src={cities[currentCityIndex].image}
                        alt={`Parking locations in ${cities[currentCityIndex].name}`}
                        className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-black/70 via-black/40 to-transparent"></div>

                      {/* City rating badge */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full px-2.5 py-1.5 flex items-center gap-1.5 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            {cities[currentCityIndex].rating}
                          </span>
                        </div>
                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-full px-2.5 py-1.5 border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg">
                          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            {cities[currentCityIndex].locations} Locations
                          </span>
                        </div>
                      </div>

                      {/* Mobile-only title (shows only on small screens) */}
                      <div className="md:hidden absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-2xl font-bold text-white">
                          {cities[currentCityIndex].name}
                        </h3>
                        <div className="flex items-center mt-2 text-white/90">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {cities[currentCityIndex].address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* City details */}
                    <div className="p-6 md:p-8 flex flex-col justify-between">
                      <div>
                        {/* Desktop title (hidden on mobile) */}
                        <div className="hidden md:block mb-6">
                          <h3 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            {cities[currentCityIndex].name}
                          </h3>
                          <div className="flex items-center text-zinc-600 dark:text-zinc-400">
                            <MapPin className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
                            <span className="text-sm">
                              {cities[currentCityIndex].address}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-zinc-700 dark:text-zinc-300 mb-6 hidden md:block">
                          {cities[currentCityIndex].description}
                        </p>

                        {/* Parking locations */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
                              <Building className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                              Featured Parking Locations
                            </h4>
                          </div>

                          <ul className="space-y-2">
                            {cities[currentCityIndex].parkingLots.map(
                              (lot, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-3"
                                >
                                  <div className="h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xs text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/30">
                                    {idx + 1}
                                  </div>
                                  <span className="text-zinc-700 dark:text-zinc-300">
                                    {lot}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {[
                            {
                              icon: <Car className="h-3.5 w-3.5" />,
                              text: "Reserved Parking",
                            },
                            {
                              icon: <Clock className="h-3.5 w-3.5" />,
                              text: "24/7 Availability",
                            },
                            {
                              icon: <ShieldCheck className="h-3.5 w-3.5" />,
                              text: "Secure Facilities",
                            },
                            {
                              icon: <MapPin className="h-3.5 w-3.5" />,
                              text: "Strategic Locations",
                            },
                          ].map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-800/30"
                            >
                              <div className="text-blue-600 dark:text-blue-400">
                                {feature.icon}
                              </div>
                              <span className="text-zinc-700 dark:text-zinc-300">
                                {feature.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* --- FIX: Add onClick handler to the button --- */}
                      <motion.button
                        onClick={() => navigate('/bookings')}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 py-3 px-6 rounded-lg font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>View Parking Locations</span>
                          <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* City indicator dots */}
          <div className="flex justify-center mt-8 gap-2">
            {cities.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCityIndex(index)}
                className={`transition-all duration-300 focus:outline-none ${
                  index === currentCityIndex
                    ? "w-8 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
                    : "w-2 h-2 bg-zinc-300 dark:bg-zinc-700 hover:bg-blue-400 dark:hover:bg-blue-700 rounded-full"
                }`}
                aria-label={`Go to ${cities[index].name}`}
              ></button>
            ))}
          </div>

          {/* Other cities preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {cities
              .filter((_, i) => i !== currentCityIndex)
              .slice(0, 4)
              .map((city, index) => (
                <div
                  key={city.name}
                  className="relative rounded-xl overflow-hidden shadow-md cursor-pointer group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() =>
                    setCurrentCityIndex(
                      cities.findIndex((c) => c.name === city.name)
                    )
                  }
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                  <img
                    src={city.image}
                    alt={city.name}
                    className={`h-24 w-full object-cover transition-transform duration-700 ${
                      hoveredIndex === index ? "scale-110" : "scale-100"
                    }`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-20">
                    <p className="text-white text-sm font-medium">
                      {city.name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-white/90">
                        {city.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;