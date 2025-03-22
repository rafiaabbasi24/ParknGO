import express from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';
import auth from '../middlewares/auth.js';
import prisma from '../prisma/client.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get PayU credentials from .env file
const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_TEST_URL = "https://test.payu.in/_payment";

/**
 * @desc    Initiate a PayU payment session
 * @route   POST /api/stripe/create-checkout-session
 * @access  Private
 */
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, email: true, mobileNumber: true },
    });

    const { registrationNumber, vehicleCategory, parkingLotId, vehicleCompanyName, inTime } = req.body;
    
    const parkingLot = await prisma.parkingLot.findUnique({
      where: { id: parkingLotId },
      select: { price: true, location: true },
    });

    if (!user || !parkingLot) {
        return res.status(404).json({ message: "User or Parking Lot not found." });
    }

    const amount = parkingLot.price;
    const productinfo = `Booking for ${vehicleCompanyName} at ${parkingLot.location}`;
    
    // Create a unique transaction ID
    const txnid = uuidv4();

    // Create a secure JWT containing all booking details
    const bookingToken = jwt.sign(
      { userId, parkingLotId, inTime, registrationNumber, vehicleCategory, vehicleCompanyName, txnid },
      process.env.JWT_PAYMENT_SECRET,
      { expiresIn: '1h' }
    );

    // Data to be sent to PayU
    const paymentData = {
      key: PAYU_KEY,
      txnid: txnid,
      amount: amount.toString(),
      productinfo: productinfo,
      firstname: user.firstName,
      email: user.email,
      phone: user.mobileNumber,
      surl: `${process.env.BACKEND_URL}/api/stripe/webhook/success?token=${bookingToken}`, // Success URL
      furl: `${process.env.BACKEND_URL}/api/stripe/webhook/failure`, // Failure URL
    };

    // --- Create the PayU Security Hash ---
    const hashString =
      `${paymentData.key}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|` +
      `${paymentData.firstname}|${paymentData.email}|||||||||||${PAYU_SALT}`;
    
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    // Combine all data to send to the frontend
    const payload = {
      ...paymentData,
      hash: hash,
      payu_url: PAYU_TEST_URL
    };

    res.status(200).json(payload);

  } catch (error) {
    console.error("Error initiating PayU payment:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;