import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/utils/backend';
import { VehicleTableLayout, StatusBadge, ParkingIdDisplay } from './VehicleTableLayout';
import { format, formatDistance } from 'date-fns';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Icons
import { 
  Calendar, 
  FileText, 
  HistoryIcon, 
  User, 
  FileDown, 
  ReceiptText, 
  Download,
  CarFront,
  ClipboardCheck,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from 'lucide-react';

interface HistoryVehicleType {
  id: string;
  parkingNumber: string;
  ownerName: string;
  registrationNumber: string;
  settledTime: string;
  remark: string;
}

const History: React.FC = () => {
  const [data, setData] = useState<HistoryVehicleType[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryVehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloading, setDownloading] = useState(false);
  // Add sort state - can be 'none', 'asc', or 'desc'
  const [sortDirection, setSortDirection] = useState<'none' | 'asc' | 'desc'>('none');

  const fetchHistory = async () => {
    const token = Cookies.get('adminToken');
    if (!token) {
      toast.error('Admin token not found!');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${BACKEND_URL}/api/admin/vehicle/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setFilteredData(response.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch historical vehicles';
      setError(msg);
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = data.filter((vehicle) =>
      vehicle.parkingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.remark.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Apply sorting if active
    if (sortDirection !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.settledTime).getTime();
        const dateB = new Date(b.settledTime).getTime();
        
        return sortDirection === 'asc' 
          ? dateA - dateB  // Ascending order (oldest first)
          : dateB - dateA; // Descending order (newest first)
      });
    }
    
    setFilteredData(filtered);
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
  
  // Enhanced PDF generation
  const generatePDF = () => {
    setDownloading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add header with logo and title
      doc.setFillColor(52, 152, 219); // Blue background
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('ParkNGo - Vehicle History', 105, 20, { align: 'center' });
      
      doc.setFontSize(11);
      const date = new Date();
      doc.text(`Generated on: ${format(date, 'PPP p')}`, 105, 30, { align: 'center' });
      
      // Add table data
      const tableColumn = ["S.No", "Parking Number", "Owner", "Vehicle Number", "Settled Time", "Remark"];
      const tableRows = filteredData.map((vehicle, index) => [
        index + 1,
        vehicle.parkingNumber,
        vehicle.ownerName,
        vehicle.registrationNumber,
        format(new Date(vehicle.settledTime), 'PPP p'),
        vehicle.remark || 'N/A'
      ]);
      
      // Generate table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { 
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { top: 50 }
      });
      
      // Add footer
      const pageCount = doc.internal.pages.length;
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${pageCount} - ParkNGo Vehicle History`, 
          105, 
          doc.internal.pageSize.height - 10, 
          { align: 'center' }
        );
      }
      
      // Save PDF
      doc.save(`ParkNGo_Vehicle_History_${format(date, 'yyyy-MM-dd')}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  // Enhanced download button with motion
  const downloadButton = (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button 
        onClick={generatePDF} 
        disabled={downloading || loading || filteredData.length === 0}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium shadow-md shadow-blue-500/10 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20"
        size="sm"
      >
        {downloading ? (
          <>
            <FileDown className="h-4 w-4 animate-bounce" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </>
        )}
      </Button>
    </motion.div>
  );

  const columns = [
    {
      key: 'index',
      header: '#',
      cell: (_: any, index: number) => (
        <div className="flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs text-blue-700 dark:text-blue-300 font-medium">
            {index + 1}
          </div>
        </div>
      ),
    },
    {
      key: 'parkingNumber',
      header: (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Parking Number</span>
        </div>
      ),
      cell: (item: HistoryVehicleType) => (
        <div className="font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md inline-block border border-blue-100 dark:border-blue-800/30">
          <ParkingIdDisplay id={item.parkingNumber} />
        </div>
      ),
    },
    {
      key: 'ownerName',
      header: (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Owner</span>
        </div>
      ),
      cell: (item: HistoryVehicleType) => <div className="font-medium">{item.ownerName}</div>,
    },
    {
      key: 'registrationNumber',
      header: (
        <div className="flex items-center gap-2">
          <CarFront className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Reg. Number</span>
        </div>
      ),
      cell: (item: HistoryVehicleType) => (
        <div className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md inline-block border border-zinc-200 dark:border-zinc-700">
          {item.registrationNumber}
        </div>
      ),
    },
    {
      key: 'settledTime',
      header: (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          onClick={toggleSort}
          title="Click to sort"
        >
          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Settled Time</span>
          {sortDirection === 'none' && (
            <ArrowUpDown className="h-3.5 w-3.5 text-blue-500/70 dark:text-blue-400/70" />
          )}
          {sortDirection === 'asc' && (
            <ChevronUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          )}
          {sortDirection === 'desc' && (
            <ChevronDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          )}
        </div>
      ),
      cell: (item: HistoryVehicleType) => {
        try {
          const date = new Date(item.settledTime);
          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                {format(date, 'MMM dd, yyyy')}
              </span>
              <span className="text-xs text-blue-600/70 dark:text-blue-500/70 mt-0.5">
                {format(date, 'h:mm a')}
              </span>
              <span className="text-xs text-blue-600/80 dark:text-blue-500/80 mt-0.5">
                {formatDistance(new Date(), date, { addSuffix: true })}
              </span>
            </div>
          );
        } catch (e) {
          return item.settledTime;
        }
      },
    },
    {
      key: 'remark',
      header: (
        <div className="flex items-center gap-2">
          <ReceiptText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Remark</span>
        </div>
      ),
      cell: (item: HistoryVehicleType) => (
        <div 
          className="max-w-[200px] truncate bg-blue-50/50 dark:bg-blue-900/10 px-2.5 py-1.5 rounded-md border border-blue-100/50 dark:border-blue-800/20 text-sm" 
          title={item.remark}
        >
          {item.remark || <span className="text-muted-foreground italic text-xs">No remark</span>}
        </div>
      ),
    },
    {
      key: 'status',
      header: (
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium">Status</span>
        </div>
      ),
      cell: () => (
        <motion.div whileHover={{ scale: 1.05 }}>
          <StatusBadge 
            status="completed" 
            text="Completed" 
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/30"
            icon={<BadgeCheck className="h-3.5 w-3.5 mr-1" />}
          />
        </motion.div>
      ),
    }
  ];

  return (
    <VehicleTableLayout
      title="Completed Bookings"
      subtitle="View history of all completed parking transactions"
      icon={<HistoryIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
      data={filteredData}
      columns={columns}
      loading={loading}
      error={error}
      onSearch={setSearchQuery}
      searchQuery={searchQuery}
      onRefresh={fetchHistory}
      emptyMessage="No history records found"
      actionComponent={downloadButton}
      themeColor="blue"
      cardClassName="bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10"
    />
  );
};

export default History;
