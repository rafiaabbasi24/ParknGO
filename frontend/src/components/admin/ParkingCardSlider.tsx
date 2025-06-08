import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Car,
  Clock,
  ArrowRight,
  CalendarClock,
  Info,
  MapPinned,
  CreditCard,
} from "lucide-react";

interface ParkingSpot {
  id: number;
  image: string;
  location: string;
  availableSlot: number;
  totalSlot: number;
  price: string;
}

interface ParkingCardSliderProps {
  parkingSpots: ParkingSpot[];
  loading: boolean;
}

export const ParkingCardSlider: React.FC<ParkingCardSliderProps> = ({
  parkingSpots,
  loading,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpots, setFilteredSpots] =
    useState<ParkingSpot[]>(parkingSpots);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSpots(parkingSpots);
    } else {
      const filtered = parkingSpots.filter((spot) =>
        spot.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpots(filtered);
      setCurrentIndex(0);
    }
  }, [searchQuery, parkingSpots]);

  const getCardsToShow = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 3;
  };

  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

  useEffect(() => {
    const handleResize = () => {
      setCardsToShow(getCardsToShow());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < filteredSpots.length - cardsToShow) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const totalPages = Math.max(1, filteredSpots.length - cardsToShow + 1);
  const paginationDots = Array.from({ length: totalPages }, (_, i) => i);

  // Render loading skeletons
  if (loading) {
    return (
      <div className="w-full">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-4 w-4 text-blue-500/70 dark:text-blue-400/70" />
          </div>
          <Input
            disabled
            placeholder="Search locations..."
            className="pl-9 h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm shadow-md"
              >
                <Skeleton className="h-48 w-full bg-blue-100/50 dark:bg-blue-900/20" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-blue-100/50 dark:bg-blue-900/20" />
                  <Skeleton className="h-4 w-1/2 bg-blue-100/50 dark:bg-blue-900/20" />
                  <Skeleton className="h-4 w-full bg-blue-100/50 dark:bg-blue-900/20" />
                  <Skeleton className="h-10 w-full mt-4 bg-blue-100/50 dark:bg-blue-900/20" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Render no results with enhanced styling
  if (filteredSpots.length === 0) {
    return (
      <div className="w-full">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-4 w-4 text-blue-500/70 dark:text-blue-400/70" />
          </div>
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
          />
        </div>

        <motion.div
          className="bg-white/80 dark:bg-zinc-900/80 rounded-xl backdrop-blur-sm border border-blue-100 dark:border-blue-900/30 shadow-md p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <Info className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-200">
            No parking locations found
          </h3>
          <p className="text-blue-700/70 dark:text-blue-400/70 mb-6 max-w-md mx-auto">
            {searchQuery
              ? `No results matching "${searchQuery}"`
              : "There are no parking locations available right now"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="hover:cursor-pointer bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30"
            >
              <Search className="h-4 w-4 mr-2" />
              Clear search
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  // Calculate if we have enough cards to scroll
  const canScroll = filteredSpots.length > cardsToShow;

  return (
    <div className="w-full">
      {/* Enhanced Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          <Search className="h-4 w-4 text-blue-500/70 dark:text-blue-400/70" />
        </div>
        <Input
          placeholder="Search parking locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0 rounded-lg"
        />
      </div>

      {/* Slider container */}
      <div className="relative">
        {/* Navigation buttons - only show if we can scroll */}
        {canScroll && (
          <>
            <Button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              size="icon"
              variant="outline"
              className={`absolute hover:cursor-pointer -left-4 md:-left-6 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg border-blue-100 dark:border-blue-900/30 bg-white/90 dark:bg-black/90 backdrop-blur-sm ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </Button>

            <Button
              onClick={nextSlide}
              disabled={currentIndex >= filteredSpots.length - cardsToShow}
              size="icon"
              variant="outline"
              className={`absolute hover:cursor-pointer -right-4 md:-right-6 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg border-blue-100 dark:border-blue-900/30 bg-white/90 dark:bg-black/90 backdrop-blur-sm ${
                currentIndex >= filteredSpots.length - cardsToShow
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            </Button>
          </>
        )}

        {/* Slider content */}
        <div ref={sliderRef} className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
            }}
          >
            <AnimatePresence>
              {filteredSpots.map((spot, index) => (
                <motion.div
                  key={spot.id}
                  className="px-3 flex-shrink-0"
                  style={{ width: `${100 / cardsToShow}%` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ParkingCard spot={spot} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Pagination dots */}
        {canScroll && paginationDots.length > 1 && (
          <div className="flex justify-center mt-6 space-x-1.5">
            {paginationDots.map((dotIndex) => (
              <button
                key={dotIndex}
                onClick={() => goToSlide(dotIndex)}
                className={`hover:cursor-pointer rounded-full transition-all ${
                  currentIndex === dotIndex
                    ? "bg-blue-500 dark:bg-blue-400 w-6 h-2"
                    : "bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 w-2 h-2"
                }`}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ParkingCardProps {
  spot: ParkingSpot;
}

const ParkingCard: React.FC<ParkingCardProps> = ({ spot }) => {
  const availabilityPercentage = (spot.availableSlot / spot.totalSlot) * 100;
  const navigate = useNavigate();

  // Determine color based on availability
  const getAvailabilityColor = () => {
    if (availabilityPercentage > 60)
      return "text-emerald-500 dark:text-emerald-400";
    if (availabilityPercentage > 30)
      return "text-amber-500 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="rounded-xl overflow-hidden shadow-lg border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-zinc-900 h-full transition-all duration-300"
    >
      {/* Card header - image with glass morphism overlays */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={spot.image || "/placeholder.svg"}
          alt={`Parking at ${spot.location}`}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Price badge */}
        <Badge className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black backdrop-blur-sm text-blue-600 dark:text-blue-400 font-medium px-2.5 py-1 border border-blue-100 dark:border-blue-900/30">
          <CreditCard className="mr-1 h-3.5 w-3.5" />
          {spot.price}
        </Badge>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3 flex items-center">
          <Badge
            variant="outline"
            className="bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black backdrop-blur-sm text-blue-600 dark:text-blue-400 py-1.5 pl-1.5 pr-2.5 border border-blue-100 dark:border-blue-900/30"
          >
            <MapPinned className="mr-1 h-3.5 w-3.5" />
            {spot.location}
          </Badge>
        </div>
      </div>

      {/* Card body with glassy highlights */}
      <div className="p-5 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-2xl"></div>

        {/* Availability section */}
        <div className="mb-5 relative z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <Car className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Availability
              </span>
            </div>
            <div className={`text-sm font-bold ${getAvailabilityColor()}`}>
              {spot.availableSlot}/{spot.totalSlot} slots
            </div>
          </div>

          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1.5 font-medium">
            {availabilityPercentage < 30 ? (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Almost full! Book quickly
              </span>
            ) : availabilityPercentage < 60 ? (
              <span>Filling up quickly</span>
            ) : (
              <span>Plenty of space available</span>
            )}
          </p>
        </div>

        {/* Action button with improved contrast for both light and dark modes */}
        <Button
          className="w-full group hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-500/5 transition-all duration-300 border border-blue-700/10 dark:border-blue-300/20"
          onClick={() => navigate(`/admin/bookings/${spot.id}`)}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          <span>Book Now</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};
