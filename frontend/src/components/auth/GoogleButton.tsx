import { ThemeContext } from "@/context/ThemeContext";
import { BACKEND_URL } from "@/utils/backend";
import { GoogleLogin } from "@react-oauth/google";
import { Spin } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const responseMessage = async (response: any) => {
    const token = response.credential;
    try {
      setLoading(true);
      const res = await axios.post(`${BACKEND_URL}/api/user/googleAuth`, {
        token,
      });
      console.log(res.data);
      if (res.status === 200) {
        Cookies.set("token", res.data.token, { expires: 7 });
        toast.success("Login successful!");
        navigate("/dashboard");
      } else if (res.status === 201) {
        Cookies.set("token", res.data.token, { expires: 7 });
        toast.success("SignUp successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    } finally {
      setLoading(false);
    }
  };
  const errorMessage = () => {
    console.log("An error occurred during Google login.");
  };
  const { theme } = useContext(ThemeContext);
  return (
    <div className="text-center mx-auto">
      {loading && (
        <Spin
          fullscreen
          size="large"
          tip={<div className="text-lg">Please Wait!</div>}
          spinning
        />
      )}
      <center>
        <GoogleLogin
          onSuccess={responseMessage}
          onError={errorMessage}
          useOneTap={false}
          theme={theme == "light" ? "outline" : "filled_black"}
          size={theme == "light" ? "large" : "medium"}
          shape="rectangular"
          auto_select={false}
        />
      </center>
    </div>
  );
};

export default GoogleButton;
