import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/utils/backend';
import { VehicleTableLayout, RemarkDialog, StatusBadge, ParkingIdDisplay } from './VehicleTableLayout';
import { format, formatDistance } from 'date-fns';
import { motion } from 'framer-motion';

// Icons
import { 
  LogOut, 
  Calendar, 
  User, 
  FileText, 
  ArrowRightLeft, 
  CarFront,
  ParkingSquare,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutVehicleType {
  id: string;
  parkingNumber: string;
  ownerName: string;
  registrationNumber: string;
  inTime: string;
}

const OutVehicle: React.FC = () => {
  const [data, setData] = useState<OutVehicleType[]>([]);
  const [filteredData, setFilteredData] = useState<OutVehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [remark, setRemark] = useState('');
  const [settling, setSettling] = useState(false);
  // Add sort state - can be 'none', 'asc', or 'desc'
  const [sortDirection, setSortDirection] = useState<'none' | 'asc' | 'desc'>('none');

  const fetchOutVehicles = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BACKEND_URL}/api/admin/vehicle/out`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch out vehicles';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutVehicles();
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

  const handleSettle = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }

    try {
      setSettling(true);
      await axios.post(
        `${BACKEND_URL}/api/admin/vehicle/settle`,
        { vehicleId: selectedId, remark },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Vehicle settled and moved to history!');
      setRemark('');
      setRemarkModalVisible(false);
      fetchOutVehicles();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to settle vehicle';
      toast.error(msg);
      console.error(err);
    } finally {
      setSettling(false);
    }
  };

  const columns = [
    {
      key: 'index',
      header: '#',
      cell: (_: any, index: number) => (
        <div className="flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xs text-amber-700 dark:text-amber-300 font-medium">
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      key: 'parkingNumber',
      header: (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium">Parking Number</span>
        </div>
      ),
      cell: (item: OutVehicleType) => (
        <div className="font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-md inline-block border border-amber-100 dark:border-amber-800/30">
          <ParkingIdDisplay id={item.parkingNumber} />
        </div>
      ),
    },
    {
      key: 'ownerName',
      header: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium">Owner</span>
        </div>
      ),
      cell: (item: OutVehicleType) => <div className="font-medium">{item.ownerName}</div>,
    },
    {
      key: 'registrationNumber',
      header: (
        <div className="flex items-center gap-2">
          <CarFront className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium">Reg. Number</span>
        </div>
      ),
      cell: (item: OutVehicleType) => (
        <div className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md inline-block border border-zinc-200 dark:border-zinc-700">
          {item.registrationNumber}
        </div>
      ),
    },
    {
      key: 'inTime',
      header: (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          onClick={toggleSort}
          title="Click to sort"
        >
          <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium">In Date</span>
          {sortDirection === 'none' && (
            <ArrowUpDown className="h-3.5 w-3.5 text-amber-500/70 dark:text-amber-400/70" />
          )}
          {sortDirection === 'asc' && (
            <ChevronUp className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          )}
          {sortDirection === 'desc' && (
            <ChevronDown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
          )}
        </div>
      ),
      cell: (item: OutVehicleType) => {
        try {
          const date = new Date(item.inTime);
          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {format(date, 'MMM dd, yyyy')}
              </span>
              <span className="text-xs text-amber-600/70 dark:text-amber-500/70 mt-0.5">
                {format(date, 'h:mm a')}
              </span>
              <span className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-0.5">
                {formatDistance(new Date(), date, { addSuffix: true })}
              </span>
            </div>
          );
        } catch (e) {
          return item.inTime;
        }
      },
    },
    {
      key: 'status',
      header: (
        <div className="flex items-center gap-2">
          <ParkingSquare className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <span className="font-medium">Status</span>
        </div>
      ),
      cell: () => (
        <motion.div whileHover={{ scale: 1.05 }}>
          <StatusBadge 
            status="parked" 
            text="Parked" 
            className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/30"
            icon={<ParkingSquare className="h-3.5 w-3.5 mr-1" />}
          />
        </motion.div>
      ),
    },
    {
      key: 'action',
      header: '',
      cell: (item: OutVehicleType) => (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-400 dark:hover:to-emerald-400 text-white dark:text-zinc-900 hover:cursor-pointer flex items-center gap-1.5 font-medium shadow-md shadow-green-500/10 dark:shadow-green-400/5 border border-green-700/10 dark:border-green-300/20"
            onClick={() => {
              setSelectedId(item.id);
              setRemarkModalVisible(true);
            }}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Settle
          </Button>
        </motion.div>
      ),
    },
  ];

  // Enhanced RemarkDialog styling for premium look
  const enhancedRemarkDialog = (
    <RemarkDialog
      isOpen={remarkModalVisible}
      onClose={() => setRemarkModalVisible(false)}
      onConfirm={handleSettle}
      remark={remark}
      setRemark={setRemark}
      title="Settle Vehicle"
      description="Add a remark to complete the parking transaction"
      confirmText={
        <span className="flex items-center gap-1.5">
          <ArrowRightLeft className="h-4 w-4" />
          {settling ? "Processing..." : "Settle Vehicle"}
        </span>
      }
      loading={settling}
      confirmButtonClassName="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
      headerClassName="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20 border-b border-amber-100 dark:border-amber-800/30"
      iconClassName="text-amber-600 dark:text-amber-400"
    />
  );

  return (
    <>
      <VehicleTableLayout
        title="Parked Vehicles"
        subtitle="Manage vehicles currently parked in your locations"
        icon={<LogOut className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
        data={filteredData}
        columns={columns}
        loading={loading}
        error={error}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onRefresh={fetchOutVehicles}
        emptyMessage="No parked vehicles found"
        themeColor="amber"
        cardClassName="bg-gradient-to-r from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10"
      />

      {enhancedRemarkDialog}
    </>
  );
};

export default OutVehicle;
