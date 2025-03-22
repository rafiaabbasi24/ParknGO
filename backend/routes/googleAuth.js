import express from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = process.env;

router.post('/', async (req, res) => {
  const token = req.body.token;

  try {
    const {data} = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    const google_id = data.aud;
    if(google_id !== GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const email = data.email;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            const newUser = await prisma.user.create({
                data: {
                    firstName: data.given_name,
                    lastName: data.family_name || "NA",
                    email,
                    password: await bcrypt.hash(data.jti, 10),
                    mobileNumber: null,
                },
            });

            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            // Hide sensitive fields in response
            const { password: _, ...userWithoutPassword } = newUser;

            return res.status(201).json({ token, user: userWithoutPassword });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({ token, user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
  } catch (error) {
    console.error('Error fetching Google token:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
