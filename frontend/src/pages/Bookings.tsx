import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ParkingCardSlider } from "../components/user/ParkingCardSlider";
import axios from "axios";
import { BACKEND_URL } from "@/utils/backend";

const Dashboard = () => {
  const navigate = useNavigate();
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  // Fetch parking data from API
  useEffect(() => {
    const fetchParkingSpots = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        const res = await axios.get(`${BACKEND_URL}/api/user/getParkings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform data for ParkingCardSlider
        const transformed = res.data.map((lot: any) => ({
          id: lot.id,
          image: lot.imgUrl,
          location: lot.location,
          availableSlot: lot.totalSlot - lot.bookedSlot,
          totalSlot: lot.totalSlot,
          price: `₹${lot.price}/hr`,
        }));

        setParkingSpots(transformed);
      } catch (error) {
        console.error("Failed to fetch parking spots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSpots();
  }, []);

  return <ParkingCardSlider parkingSpots={parkingSpots} loading={loading} />;
};

export default Dashboard;
