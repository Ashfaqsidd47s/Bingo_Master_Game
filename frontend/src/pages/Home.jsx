import React, { useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';


function Home() {
  const [tempOpen, setTempOpen] = useState(false);
  const {user, setUser} = useUser();
  const navigate = useNavigate();

  const numbers = [3, 8, 14, 19, 21, 25];

  const handlePlay = () => {
    navigate("/game");
  }

  const handleGameOver =  () => {
    setTempOpen(false);
  }

  useEffect(() => {
    const getUser = async ()=> {
      const res = await axios.get("http://localhost:8080/private" , { withCredentials: true })
      setUser(res.data);
    }
    getUser();
  }, [])

  

  return (
    <div className=' p-4 md:h-[100vh]'>
      <div className=' h-full border-2 md:px-[8rem] border-indigo-500 rounded-lg flex flex-col md:flex-row items-center relative z-10 overflow-hidden '>
        <div className='p-4 left-part h-[100vh] w-full md:h-full flex flex-col items-center md:items-start justify-center gap-4 flex-none md:w-[60%]'>
          <h1 className=' z-10 mb-4 text-6xl md:text-8xl font-semibold'>Bingo-master</h1>
          <p className='w-[300px] text-center md:text-start text-xl md:text-2xl text-gray-600'>Let's play the best online multiplayer game with strangers and be the bingo master </p>
          <button className=' w-full md:w-[200px] mt-8 bg-indigo-400 p-4 text-xl font-semibold rounded-md hover:bg-indigo-500' onClick={handlePlay}>Play</button>
        </div>
        <div className='right-part h-[100vh] w-full md:h-full flex items-center justify-start flex-none md:w-[40%] ' >
          <img 
            className=' w-[80%] rotate-12 animate-float'
            src="./bingo.png" 
            alt="" 
          />
        </div>
        <span
          className=' w-[150px] h-[150px] bg-indigo-400 p-2 border-4 rounded-lg border-indigo-500 absolute top-0 text-6xl font-extrabold animate-floattwo z-[-1] right-5 flex items-center justify-center'
        >25</span>
        <span
          className=' w-[100px] h-[100px] bg-indigo-400 p-2 border-4 rounded-lg border-indigo-500 absolute top-0 text-6xl font-extrabold animate-floattwo5 z-[-1] right-[20%] flex items-center justify-center'
        >5</span>
        <span
          className=' w-[100px] h-[100px] bg-indigo-400 p-2 border-4 rounded-lg border-indigo-500 absolute top-0 text-6xl font-extrabold animate-floattwo6 z-[-1] right-[40%] flex items-center justify-center'
        >7</span>
        <span
          className=' w-[100px] h-[100px] bg-indigo-400 p-2 border-4 rounded-lg border-indigo-500 absolute top-0 text-6xl font-extrabold animate-floattwo12 z-[-1] right-[40%] flex items-center justify-center'
        >9</span>
        <span
          className=' w-[100px] h-[100px] bg-indigo-400 p-2 border-4 rounded-lg border-indigo-500 absolute top-0 text-6xl font-extrabold animate-floattwo12 z-[-1] right-[60%] flex items-center justify-center'
        >1</span>
      </div>
    </div>
  )
}

export default Home