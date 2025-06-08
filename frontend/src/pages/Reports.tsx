import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import Report from "@/components/user/Report";
// import { Skeleton } from "@mui/material";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return <Report />;
};

export default Dashboard;
