import { Spin } from 'antd';
import Cookies from 'js-cookie';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate()
    useEffect(()=>{
        Cookies.remove("token");
        Cookies.remove("adminToken");
        navigate('/');
    },[])
  return (
    <div><Spin fullscreen size='large' spinning tip={<div className='text-lg font-semibold'>Logging Out</div>}/></div>
  )
}

export default Logout