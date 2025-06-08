import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ShadCN UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  MapPin,
  CreditCard,
  ArrowRight,
  Car,
  Timer,
  Info,
  Scan,
  CheckCircle2,
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
  const [filteredSpots, setFilteredSpots] = useState<ParkingSpot[]>(parkingSpots);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate how many cards to show based on viewport width
  const getCardsToShow = () => {
    if (typeof window === "undefined") return 3;
    
    const width = window.innerWidth;
    if (width < 640) return 1;        // Mobile
    if (width < 1024) return 2;       // Tablet
    if (width < 1536) return 3;       // Desktop
    return 4;                         // Large Desktop
  };

  const [cardsToShow, setCardsToShow] = useState(getCardsToShow());
  
  // Filter spots based on search query
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newCardsToShow = getCardsToShow();
      setCardsToShow(newCardsToShow);
      
      // Reset index if needed when resizing
      if (currentIndex > filteredSpots.length - newCardsToShow) {
        setCurrentIndex(Math.max(0, filteredSpots.length - newCardsToShow));
      }
      
      // Auto-switch to grid on mobile/small screens
      if (window.innerWidth < 768 && viewMode === 'carousel') {
        setViewMode('grid');
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener("resize", handleResize);
  }, [filteredSpots.length, currentIndex, viewMode]);

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
  const canScroll = filteredSpots.length > cardsToShow;

  // Loading state with skeletons
  if (loading) {
    return (
      <div className="w-full p-10">
        {/* Search bar skeleton */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-blue-500/60 dark:text-blue-400/60" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-11 w-full rounded-full bg-blue-100/40 dark:bg-blue-900/20" />
            <Skeleton className="h-11 w-11 rounded-full flex-shrink-0 bg-blue-100/40 dark:bg-blue-900/20" />
          </div>
        </div>
        
        {/* Card skeletons in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl overflow-hidden border border-blue-100/50 dark:border-blue-900/20 bg-white/80 dark:bg-zinc-900/80 shadow-md backdrop-blur-sm">
              <Skeleton className="h-44 w-full rounded-none bg-blue-100/40 dark:bg-blue-900/20" />
              <div className="p-5 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-2/5 rounded-md bg-blue-100/40 dark:bg-blue-900/20" />
                  <Skeleton className="h-6 w-1/4 rounded-md bg-blue-100/40 dark:bg-blue-900/20" />
                </div>
                <Skeleton className="h-2 w-full rounded-md bg-blue-100/40 dark:bg-blue-900/20" />
                <Skeleton className="h-10 w-full rounded-md bg-blue-100/40 dark:bg-blue-900/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No results state
  if (filteredSpots.length === 0) {
    return (
      <div className="w-full px-0 sm:px-2">
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-blue-500/70 dark:text-blue-400/70" />
          </div>
          <Input
            placeholder="Find parking locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-11 rounded-full border-blue-100 dark:border-blue-900/30 bg-white/90 dark:bg-zinc-900/90 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0"
          />
        </div>

        <motion.div
          className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-xl p-8 sm:p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-900/30 shadow-inner">
            <Info className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-blue-900 dark:text-blue-100">
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
              className="rounded-full px-6 py-2 hover:cursor-pointer bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30"
            >
              <Search className="h-4 w-4 mr-2" />
              Clear search
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  // Main content with cards in either carousel or grid layout
  return (
    <div className="w-full p-10">
      {/* Enhanced Search bar with view toggle */}
      <div className="mb-6 flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-blue-500/70 dark:text-blue-400/70" />
          </div>
          <Input
            placeholder="Find parking locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-11 rounded-full border-blue-100 dark:border-blue-900/30 bg-white/90 dark:bg-zinc-900/90 focus-visible:ring-1 focus-visible:ring-blue-400 focus-visible:ring-offset-0"
          />
        </div>
        
        {/* View toggle button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === 'grid' ? 'carousel' : 'grid')}
          className="h-11 w-11 rounded-full border-blue-100 dark:border-blue-900/30 bg-white/90 dark:bg-zinc-900/90 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:cursor-pointer text-blue-700 dark:text-blue-400"
          title={viewMode === 'grid' ? 'View as carousel' : 'View as grid'}
        >
          {viewMode === 'grid' ? (
            <Timer className="h-5 w-5" />
          ) : (
            <Scan className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* View mode: Grid */}
      {viewMode === 'grid' && (
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredSpots.map((spot, index) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ParkingCard spot={spot} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* View mode: Carousel */}
      {viewMode === 'carousel' && (
        <div className="relative">
          {/* Navigation buttons */}
          {canScroll && (
            <>
              <Button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                size="icon"
                variant="outline"
                className={cn(
                  "absolute hover:cursor-pointer -left-5 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg",
                  "border-blue-100 dark:border-blue-900/30 bg-white/95 dark:bg-black/95 backdrop-blur-sm",
                  currentIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              </Button>

              <Button
                onClick={nextSlide}
                disabled={currentIndex >= filteredSpots.length - cardsToShow}
                size="icon"
                variant="outline"
                className={cn(
                  "absolute hover:cursor-pointer -right-5 top-1/2 transform -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg",
                  "border-blue-100 dark:border-blue-900/30 bg-white/95 dark:bg-black/95 backdrop-blur-sm",
                  currentIndex >= filteredSpots.length - cardsToShow
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                )}
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              </Button>
            </>
          )}

          {/* Carousel container with overflow handling */}
          <div className="overflow-hidden px-1 py-2">
            <div
              ref={sliderRef}
              className="flex transition-all duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)`,
              }}
            >
              <AnimatePresence>
                {filteredSpots.map((spot) => (
                  <motion.div
                    key={spot.id}
                    className="pr-5 xl:pr-6"
                    style={{ 
                      width: `${100 / cardsToShow}%`,
                      minWidth: `${100 / cardsToShow}%`,
                      flexShrink: 0
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ParkingCard spot={spot} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Enhanced Pagination dots */}
          {canScroll && paginationDots.length > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-1.5">
              {paginationDots.map((dotIndex) => (
                <button
                  key={dotIndex}
                  onClick={() => goToSlide(dotIndex)}
                  className={cn(
                    "transition-all duration-300 focus:outline-none hover:cursor-pointer",
                    currentIndex === dotIndex
                      ? "w-6 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                      : "w-2 h-2 bg-blue-200 dark:bg-blue-800 rounded-full hover:bg-blue-300 dark:hover:bg-blue-700"
                  )}
                  aria-label={`Go to slide ${dotIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ParkingCardProps {
  spot: ParkingSpot;
}

// Enhanced card component with better styling and animations
const ParkingCard: React.FC<ParkingCardProps> = ({ spot }) => {
  const availabilityPercentage = (spot.availableSlot / spot.totalSlot) * 100;
  const navigate = useNavigate();

  // Get appropriate colors based on availability
  const getAvailabilityStyles = () => {
    if (availabilityPercentage > 60) {
      return {
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500",
        progressBg: "bg-emerald-100 dark:bg-emerald-900/30",
        statusBg: "bg-emerald-50 dark:bg-emerald-900/20",
        statusBorder: "border-emerald-100 dark:border-emerald-900/30"
      };
    }
    if (availabilityPercentage > 30) {
      return {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500",
        progressBg: "bg-amber-100 dark:bg-amber-900/30",
        statusBg: "bg-amber-50 dark:bg-amber-900/20",
        statusBorder: "border-amber-100 dark:border-amber-900/30"
      };
    }
    return {
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500",
      progressBg: "bg-red-100 dark:bg-red-900/30",
      statusBg: "bg-red-50 dark:bg-red-900/20",
      statusBorder: "border-red-100 dark:border-red-900/30"
    };
  };

  const styles = getAvailabilityStyles();

  return (
    <motion.div
      className="h-full flex flex-col rounded-2xl overflow-hidden border border-blue-100/50 dark:border-blue-900/20 bg-white dark:bg-zinc-900 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {/* Card header with image and gradient overlay */}
      <div className="relative h-44 overflow-hidden bg-blue-50 dark:bg-blue-900/20">
        {/* Image with zoom effect */}
        <img
          src={spot.image || "/placeholder.svg"}
          alt={`Parking at ${spot.location}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?q=80&w=500";
          }}
        />
        
        {/* Overlay gradients for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Price badge */}
        <Badge className="absolute top-3 right-3 bg-white/95 dark:bg-zinc-900/95 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-sm text-blue-600 dark:text-blue-400 font-medium px-3 py-1.5 rounded-full border border-blue-100/50 dark:border-blue-900/30 shadow-md">
          <CreditCard className="mr-1.5 h-3.5 w-3.5" />
          {spot.price}
        </Badge>

        {/* Location badge */}
        <div className="absolute bottom-3 left-3">
          <h3 className="text-white font-semibold text-lg drop-shadow-md mb-1">{spot.location}</h3>
          <Badge
            variant="outline"
            className="bg-white/95 dark:bg-zinc-900/95 hover:bg-white dark:hover:bg-zinc-900 backdrop-blur-sm text-blue-600 dark:text-blue-400 py-1 px-2.5 rounded-full border border-blue-100/50 dark:border-blue-900/30 shadow-sm"
          >
            <MapPin className="mr-1 h-3.5 w-3.5" />
            {spot.totalSlot} total spaces
          </Badge>
        </div>
      </div>

      {/* Card body with availability info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Availability section */}
        <div className="mb-4 flex-grow">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5">
              <Car className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-sm font-medium">Available Slots</span>
            </div>
            <div className={`text-sm font-bold ${styles.color}`}>
              {spot.availableSlot}/{spot.totalSlot}
            </div>
          </div>

          {/* Custom progress bar */}
          <div className={`w-full h-2 rounded-full ${styles.progressBg}`}>
            <div
              className={`h-full rounded-full ${styles.bg}`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>

          {/* Availability status */}
          <div className="mt-3">
            <Badge 
              className={cn(
                "gap-1 font-medium",
                styles.statusBg,
                styles.statusBorder,
                styles.color
              )}
            >
              {availabilityPercentage > 60 ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Plenty of spaces</span>
                </>
              ) : availabilityPercentage > 30 ? (
                <>
                  <Clock className="h-3.5 w-3.5" />
                  <span>Filling up quickly</span>
                </>
              ) : (
                <>
                  <Timer className="h-3.5 w-3.5" />
                  <span>Almost full!</span>
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Action button with improved styling */}
        <Button
          className="w-full group hover:cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20 rounded-xl py-6 text-base"
          onClick={() => {
            if (spot.availableSlot > 0) {
              navigate(`/bookings/${spot.id}`);
            } else {
              toast.error("No available slots for booking.");
            }
          }}
          disabled={spot.availableSlot <= 0}
        >
          <Timer className="mr-2 h-4 w-4" />
          <span>Book Now</span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};
