import React, { useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Home() {
  const {user, setUser} = useUser();
  const navigate = useNavigate();
  const handlePlay = () => {
    navigate("/game");
  }

  useEffect(() => {
    const getUser = async ()=> {
      const res = await axios.get("http://localhost:8080/private" , { withCredentials: true })
      setUser(res.data);
    }
    getUser();
  }, [])

  return (
    <div className=' p-4 h-[100vh]'>
      <div className=' h-full border-2 border-red-300 flex flex-col items-center justify-center gap-8 relative z-10 overflow-hidden bg-gray-700'>
        <img className=' absolute z-0 w-full opacity-50' src="/boysbg.jpeg" alt="" />
        <h1 className=' z-10 text-5xl md:text-8xl font-extrabold text-[#FDE3EE]'>BINGO MASTER</h1>
        <button className=' z-10 w-[200px] bg-[#FFA7E1] p-5 text-xl font-semibold rounded-md hover:bg-[#f998d9]' onClick={handlePlay}>Play</button>
      </div>
    </div>
  )
}

export default Home