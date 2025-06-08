import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/utils/backend';
import { VehicleTableLayout, StatusBadge, ParkingIdDisplay } from './VehicleTableLayout';
import { format, formatDistance } from 'date-fns';
import { motion } from 'framer-motion';

// Icons
import { 
  Car, 
  Calendar, 
  User, 
  FileText, 
  Clock, 
  CarFront, 
  TimerIcon,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';

interface InVehicleType {
  id: string;
  parkingNumber: string;
  ownerName: string;
  registrationNumber: string;
  inTime: string;
}

const InVehicle: React.FC = () => {
  const [data, setData] = useState<InVehicleType[]>([]);
  const [filteredData, setFilteredData] = useState<InVehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Add sort state - can be 'none', 'asc', or 'desc'
  const [sortDirection, setSortDirection] = useState<'none' | 'asc' | 'desc'>('none');

  const fetchInVehicles = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BACKEND_URL}/api/admin/vehicle/upcoming`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch in vehicles';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInVehicles();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      let filtered = data.filter(
        (vehicle) =>
          vehicle.parkingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Apply sorting if active
      if (sortDirection !== 'none') {
        filtered = [...filtered].sort((a, b) => {
          const dateA = new Date(a.inTime).getTime();
          const dateB = new Date(b.inTime).getTime();
          
          return sortDirection === 'asc' 
            ? dateA - dateB  // Ascending order (oldest first)
            : dateB - dateA; // Descending order (newest first)
        });
      }
      
      setFilteredData(filtered);
    } else {
      // Also apply sorting when no search is active
      if (sortDirection !== 'none') {
        const sorted = [...data].sort((a, b) => {
          const dateA = new Date(a.inTime).getTime();
          const dateB = new Date(b.inTime).getTime();
          
          return sortDirection === 'asc' 
            ? dateA - dateB
            : dateB - dateA;
        });
        setFilteredData(sorted);
      } else {
        setFilteredData(data);
      }
    }
  }, [searchQuery, data, sortDirection]);
  
  // Handle column sorting
  const toggleSort = () => {
    // Cycle through: none -> asc -> desc -> none
    if (sortDirection === 'none') {
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortDirection('none');
    }
  };

  // Format date with relative time (enhanced styling)
  const formatInTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    try {
      // If it's in the future, show how far away
      if (date > now) {
        return (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {format(date, 'MMM dd, yyyy')}
            </span>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-0.5 flex items-center gap-1">
              <TimerIcon className="h-3 w-3" />
              {formatDistance(date, now, { addSuffix: true })}
            </span>
            <span className="text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">
              {format(date, 'h:mm a')}
            </span>
          </div>
        );
      } else {
        // If it's in the past
        return (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {format(date, 'MMM dd, yyyy')}
            </span>
            <span className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-0.5 flex items-center gap-1">
              <TimerIcon className="h-3 w-3" />
              {formatDistance(now, date, { addSuffix: true })}
            </span>
            <span className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-0.5">
              {format(date, 'h:mm a')}
            </span>
          </div>
        );
      }
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    {
      key: 'index',
      header: '#',
      cell: (_: any, index: number) => (
        <div className="flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      key: 'parkingNumber',
      header: (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Parking Number</span>
        </div>
      ),
      cell: (item: InVehicleType) => (
        <div className="font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md inline-block border border-emerald-100 dark:border-emerald-800/30">
          <ParkingIdDisplay id={item.parkingNumber} />
        </div>
      ),
    },
    {
      key: 'ownerName',
      header: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Owner</span>
        </div>
      ),
      cell: (item: InVehicleType) => <div className="font-medium">{item.ownerName}</div>,
    },
    {
      key: 'registrationNumber',
      header: (
        <div className="flex items-center gap-2">
          <CarFront className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Reg. Number</span>
        </div>
      ),
      cell: (item: InVehicleType) => (
        <div className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md inline-block border border-zinc-200 dark:border-zinc-700">
          {item.registrationNumber}
        </div>
      ),
    },
    {
      key: 'inTime',
      header: (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          onClick={toggleSort}
          title="Click to sort"
        >
          <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Arrival Time</span>
          {sortDirection === 'none' && (
            <ArrowUpDown className="h-3.5 w-3.5 text-emerald-500/70 dark:text-emerald-400/70" />
          )}
          {sortDirection === 'asc' && (
            <ChevronUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          )}
          {sortDirection === 'desc' && (
            <ChevronDown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          )}
        </div>
      ),
      cell: (item: InVehicleType) => formatInTime(item.inTime),
    },
    {
      key: 'status',
      header: (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">Status</span>
        </div>
      ),
      cell: (item: InVehicleType) => {
        const arrivalDate = new Date(item.inTime);
        const now = new Date();
        
        if (arrivalDate > now) {
          return (
            <motion.div whileHover={{ scale: 1.05 }}>
              <StatusBadge 
                status="upcoming"
                text="Upcoming" 
                className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30"
                icon={<Clock className="h-3.5 w-3.5 mr-1" />}
              />
            </motion.div>
          );
        } else {
          return (
            <motion.div whileHover={{ scale: 1.05 }}>
              <StatusBadge 
                status="due"
                text="Due for Arrival" 
                className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/30"
                icon={<Clock className="h-3.5 w-3.5 mr-1" />}
              />
            </motion.div>
          );
        }
      },
    },
  ];

  return (
    <VehicleTableLayout
      title="Upcoming Vehicles"
      subtitle="View all vehicles that are due for arrival"
      icon={<Car className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
      data={filteredData}
      columns={columns}
      loading={loading}
      error={error}
      onSearch={setSearchQuery}
      searchQuery={searchQuery}
      onRefresh={fetchInVehicles}
      emptyMessage="No upcoming vehicles found"
      themeColor="emerald"
      cardClassName="bg-gradient-to-r from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10"
    />
  );
};

export default InVehicle;
