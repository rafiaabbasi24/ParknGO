import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

interface Booking {
  id: string;
  registrationNumber: string;
  location: string;
  company: string;
  category: string;
  inTime: string;
  outTime: string | null;
  totalSpent: number;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  regDate: string;
  profileImage: string;
}

export const generateInvoicePDF = async (
  booking: Booking,
  profile: UserProfile
) => {
  const doc = new jsPDF();
  const marginLeft = 15;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(245, 245, 245);
  doc.rect(0, 0, pageWidth, 43, "F");
  doc.setFontSize(18).setFont("helvetica", "bold").setTextColor(40);
  doc.text("EazyParking", marginLeft, 20);

  doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(90);
  doc.text("support@eazyparking.tech", marginLeft, 27);
  doc.text("www.eazyparking.tech", marginLeft, 32);

  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(0);
  doc.text("INVOICE", pageWidth - marginLeft, 20, { align: "right" });

  const invoiceNo = `INV-${booking.id.slice(-6)}`;
  const invoiceDate = new Date().toLocaleDateString();

  doc.setFontSize(10).setFont("helvetica", "bold").setTextColor(80);
  doc.text(`Invoice No: ${invoiceNo}`, pageWidth - marginLeft, 28, {
    align: "right",
  });
  doc.text(`Date: ${invoiceDate}`, pageWidth - marginLeft, 34, {
    align: "right",
  });
  doc.text(`Booking Id: ${booking.id}`, pageWidth - marginLeft, 40, {
    align: "right",
  });

  // Customer Info
  let y = 50;
  doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(33);
  doc.text("Billed To", marginLeft, y);
  y += 6;
  doc.setFontSize(10).setFont("helvetica", "normal").setTextColor(60);
  doc.text(`${profile.firstName} ${profile.lastName}`, marginLeft, y);
  y += 5;
  doc.text(`Email: ${profile.email}`, marginLeft, y);
  y += 5;
  doc.text(`Mobile: ${profile.mobileNumber || "NA"}`, marginLeft, y);

  // Booking Summary
  y += 10;
  doc.setFont("helvetica", "bold").setTextColor(33);
  doc.text("Booking Summary", marginLeft, y);

  autoTable(doc, {
    startY: y + 6,
    head: [
      [
        "Vehicle Company",
        "Reg No",
        "Category",
        "Location",
        "Check-In",
        "Check-Out",
        "Amount (Rs)",
      ],
    ],
    body: [
      [
        booking.company,
        booking.registrationNumber,
        booking.category,
        booking.location,
        new Date(booking.inTime).toLocaleString(),
        booking.outTime ? new Date(booking.outTime).toLocaleString() : "-",
        booking.totalSpent.toFixed(2),
      ],
    ],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3, valign: "middle" },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: { 6: { halign: "right" } },
    margin: { left: marginLeft, right: marginLeft },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Fee Breakdown
  const baseFare = booking.totalSpent;
  const gst = baseFare * 0.18;
  const discount = gst;
  const total = baseFare;

  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(33);
  doc.text("Fee Breakdown", marginLeft, finalY);

  let feeY = finalY + 6;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(60);
  doc.text(`Base Fare: Rs ${baseFare.toFixed(2)}`, marginLeft, feeY);
  feeY += 5;
  doc.text(`GST (18%): Rs ${gst.toFixed(2)}`, marginLeft, feeY);
  feeY += 5;
  doc.text(`Discount: -Rs ${discount.toFixed(2)}`, marginLeft, feeY);

  doc.setFont("helvetica", "bold").setTextColor(22, 160, 133).setFontSize(12);
  doc.text(`Total Payable: Rs ${total.toFixed(2)}`, marginLeft, feeY + 10);

  // Footer (moved down to allow for QR code and stamp placement)
  const footerY = feeY + 30;
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(120);
  doc.text("Authorized Signature", marginLeft, footerY);
  doc.line(marginLeft, footerY + 1, marginLeft + 50, footerY + 1);
  doc.text("EazyParking.tech", marginLeft, footerY + 10);

  doc.setFont("helvetica", "italic").setTextColor(150).setFontSize(10);
  doc.text(
    "Thank you for choosing EazyParking. We appreciate your business!",
    pageWidth / 2,
    footerY + 30,
    { align: "center" }
  );

  // Generate QR Code
  const qrData = `Invoice: ${invoiceNo}, Booking ID: ${
    booking.id
  }, Total: Rs ${total.toFixed(2)}`;
  const qrCode = await QRCode.toDataURL(qrData);

  // Add QR code to the document
  const qrCodeSize = 30; // size of the QR code
  doc.addImage(
    qrCode,
    "PNG",
    pageWidth - qrCodeSize - 15,
    footerY - 50,
    qrCodeSize,
    qrCodeSize
  );

  // Add 'PAID' Stamp (adjusted position)
  doc.setFont("helvetica", "bold").setTextColor(255).setFontSize(20);
  doc.setFillColor(76, 175, 80); // green
  doc.rect(pageWidth - 60, footerY - 18, 45, 12, "F");
  doc.text("PAID", pageWidth - 38, footerY - 9);
  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Note: This is a computer-generated invoice. No signature required.",
    marginLeft,
    doc.internal.pageSize.getHeight() - 15
  );

  // Save PDF
  doc.save(`Invoice_${booking.registrationNumber}.pdf`);
};
