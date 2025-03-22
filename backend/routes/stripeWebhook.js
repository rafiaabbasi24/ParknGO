import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prisma/client.js'; // Import Prisma client

const router = express.Router();

// --- FIX: Add middleware to parse URL-encoded form data from PayU ---
router.use(express.urlencoded({ extended: true }));
// -----------------------------------------------------------------

const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_KEY = process.env.PAYU_KEY;

/**
 * @desc    Handle successful payment callback from PayU
 * @route   POST /api/stripe/webhook/success
 */
router.post('/success', async (req, res) => {
  try {
    const { status, txnid, amount, productinfo, firstname, email, hash } = req.body;
    const { token } = req.query; // The booking details token

    if (!status) {
        console.error('❌ PayU response body is empty or malformed.');
        return res.redirect(`${process.env.FRONTEND_URL}/booking-status?status=failed&reason=invalid_response`);
    }

    // --- 1. Verify the payment hash from PayU to ensure it's a legitimate response ---
    const hashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (hash !== calculatedHash) {
      console.error('❌ Payment hash verification failed.');
      return res.redirect(`${process.env.FRONTEND_URL}/booking-status?status=failed&reason=hash_mismatch`);
    }

    // --- 2. Verify the JWT to securely get the booking details ---
    const decoded = jwt.verify(token, process.env.JWT_PAYMENT_SECRET);
    
    const {
      userId,
      registrationNumber,
      vehicleCategory, // This is the category ID
      parkingLotId,
      vehicleCompanyName,
      inTime,
    } = decoded;
    
    // --- FIX: Use the correct field name 'mihpayid' for the payment ID from PayU ---
    const paymentId = req.body.mihpayid || txnid; // Use PayU's ID, or fall back to our own transaction ID
    // -------------------------------------------------------------------------

    // --- 3. Create the booking and vehicle records in the database ---
    console.log('✅ Payment successful and verified. Creating booking...');

    // Use a Prisma transaction to ensure all database operations succeed or fail together
    const newBooking = await prisma.$transaction(async (tx) => {
      // Create the main booking record
      const booking = await tx.booking.create({
        data: {
          userId: userId,
          parkingLotId: parkingLotId,
          paymentId: paymentId.toString(),
        },
      });

      // Create the associated vehicle record
      await tx.vehicle.create({
        data: {
          bookId: booking.bookId, // Link to the new booking
          categoryId: vehicleCategory,
          vehicleCompanyName: vehicleCompanyName,
          registrationNumber: registrationNumber,
          inTime: new Date(inTime),
          status: 'IN',
        },
      });

      // Increment the bookedSlot count for the parking lot
      await tx.parkingLot.update({
        where: { id: parkingLotId },
        data: {
          bookedSlot: {
            increment: 1,
          },
        },
      });

      return booking;
    });

    if (!newBooking) {
        throw new Error("Failed to create booking in database.");
    }

    console.log(`✅ Booking created successfully with ID: ${newBooking.bookId}`);

    // --- 4. Redirect user to the frontend success page ---
    res.redirect(`${process.env.FRONTEND_URL}/booking-status?status=success&txnid=${txnid}`);

  } catch (err) {
    console.error('❌ Error in success webhook:', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/booking-status?status=failed&reason=server_error`);
  }
});

/**
 * @desc    Handle failed payment callback from PayU
 * @route   POST /api/stripe/webhook/failure
 */
router.post('/failure', (req, res) => {
  console.log('Payment failed:', req.body);
  res.redirect(`${process.env.FRONTEND_URL}/booking-status?status=failed&reason=payment_declined`);
});

export default router;
