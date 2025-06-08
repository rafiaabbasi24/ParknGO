import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/utils/backend";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

export const useReportData = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [ongoing, setOngoing] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<"csv" | "pdf" | null>(null);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/user/report`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Classify bookings into categories
  useEffect(() => {
    const classifyBookings = () => {
      const now = new Date();
      const upcomingList: any[] = [];
      const ongoingList: any[] = [];
      const pastList: any[] = [];

      for (const booking of bookings) {
        const inTime = new Date(booking.inTime);
        const outTime = booking.outTime ? new Date(booking.outTime) : null;

        if (inTime > now) {
          upcomingList.push(booking);
        } else if (outTime && outTime < now) {
          pastList.push(booking);
        } else {
          ongoingList.push(booking);
        }
      }

      // Sort each list by the relevant date field
      upcomingList.sort(
        (a, b) => new Date(a.inTime).getTime() - new Date(b.inTime).getTime()
      );
      ongoingList.sort(
        (a, b) => new Date(b.inTime).getTime() - new Date(a.inTime).getTime()
      );
      pastList.sort(
        (a, b) => new Date(b.outTime).getTime() - new Date(a.outTime).getTime()
      );

      setOngoing(ongoingList);
      setPast(pastList);
      setUpcoming(upcomingList);
    };

    classifyBookings();
  }, [bookings]);

  // Initial data fetch
  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Export functions
  const exportCSV = async () => {
    try {
      setExporting("csv");

      const csv = Papa.unparse(
        bookings.map((b) => ({
          "Company Name": b.company || "N/A",
          "Registration Number": b.registrationNumber || "N/A",
          Location: b.location,
          "Vehicle Category": b.category || "N/A",
          "In Time": new Date(b.inTime).toLocaleString(),
          "Out Time": b.outTime ? new Date(b.outTime).toLocaleString() : "-",
          "Total Spent": `₹${b.totalSpent || 0}`,
        }))
      );

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `EazyParking_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV exported successfully!");
    } catch (err) {
      console.error("CSV export error:", err);
      toast.error("Failed to export CSV");
    } finally {
      setExporting(null);
    }
  };

  const exportPDF = async () => {
    try {
      setExporting("pdf");

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Add logo and fancy header
      const headerGradient = () => {
        doc.setFillColor(59, 130, 246); // blue-600
        doc.rect(0, 0, pageWidth, 40, "F");
        doc.setFillColor(79, 70, 229); // indigo-600
        doc.rect(pageWidth - 40, 0, 40, 40, "F");
      };

      headerGradient();

      // Title
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("Parking Bookings Report", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

      // User Info
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(11);
      doc.text(`Total Bookings: ${bookings.length}`, 14, 50);

      // Section headers with color coding
      const sections = [
        {
          title: "Ongoing Bookings",
          data: ongoing,
          color: [59, 130, 246] as [number, number, number],
        }, // blue
        {
          title: "Upcoming Bookings",
          data: upcoming,
          color: [79, 70, 229] as [number, number, number],
        }, // indigo
        {
          title: "Past Bookings",
          data: past,
          color: [124, 58, 237] as [number, number, number],
        }, // purple
      ];

      let yPosition = 60;

      sections.forEach((section) => {
        if (section.data.length > 0) {
          // Section title
          doc.setFillColor(...section.color);
          doc.roundedRect(14, yPosition, pageWidth - 28, 10, 2, 2, "F");

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          doc.text(section.title, 20, yPosition + 6.5);

          yPosition += 15;

          // Table
          autoTable(doc, {
            startY: yPosition,
            head: [
              [
                "Company",
                "Reg Number",
                "Location",
                "In Time",
                ...(section.title === "Past Bookings" ? ["Out Time"] : []),
                "Total Spent",
              ],
            ],
            body: section.data.map((b) => [
              b.company || "N/A",
              b.registrationNumber || "N/A",
              b.location || "N/A",
              new Date(b.inTime).toLocaleString(),
              ...(section.title === "Past Bookings"
                ? [new Date(b.outTime).toLocaleString()]
                : []),
              `₹${b.totalSpent || 0}`,
            ]),
            styles: {
              fontSize: 9,
              cellPadding: 3,
            },
            headStyles: {
              fillColor: section.color,
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 247, 250],
            },
            margin: { top: 10, right: 14, bottom: 10, left: 14 },
          });

          yPosition = doc.lastAutoTable.finalY + 20;
        }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(59, 130, 246); // blue-600
        doc.line(
          14,
          doc.internal.pageSize.height - 20,
          pageWidth - 14,
          doc.internal.pageSize.height - 20
        );

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text(
          "EazyParking - Your Parking Management Solution",
          pageWidth / 2,
          doc.internal.pageSize.height - 12,
          { align: "center" }
        );

        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 14,
          doc.internal.pageSize.height - 12,
          { align: "right" }
        );
      }

      // Save PDF
      doc.save(
        `EazyParking_Report_${new Date().toISOString().slice(0, 10)}.pdf`
      );
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(null);
    }
  };

  return {
    bookings,
    ongoing,
    upcoming,
    past,
    loading,
    exporting,
    exportCSV,
    exportPDF,
    refresh: fetchReportData,
  };
};
