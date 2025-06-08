import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import Profiledata from "../components/user/Settings";

const Dashboard = () => {
  const navigate = useNavigate();
  // Auth check
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return <Profiledata />;
};

export default Dashboard;
