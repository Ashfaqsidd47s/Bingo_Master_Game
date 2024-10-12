import React, { useState } from 'react'
import { useUser } from '../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const {user, setUser} = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();
    console.log(user)
    console.log("form submited")
    setUser({email, password})
    navigate("/game");
  }

  

  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
      <div className='w-full md:w-[800px] h-full md:h-[500px] p-4 rounded-2xl flex items-center justify-center bg-red-300'>
        <div className=' w-full h-full md:basis-1/2 border-2 border-slate-900 flex flex-col items-center justify-center'>
          <h1 className=' text-3xl font-bold'>Login to Bingo Master</h1>
          <form className=' p-4 w-[80%] min-w-[340px]'>
            <div className='inputContainer flex flex-col gap-2 mb-2'>
                <label htmlFor="emailInput">Email</label>
                <input 
                  value={email}
                  onChange={(e)=>(setEmail(e.target.value))}
                  type="text" 
                  id='emailInput' 
                  className=' p-2 rounded-md border-none outline-none focus:outline-slate-400 focus:outline-2'
                 />
            </div>
            <div className='inputContainer flex flex-col gap-2 mb-4'>
                <label htmlFor="passwordInput">Password</label>
                <input 
                  value={password}
                  onChange={(e)=>(setPassword(e.target.value))}
                  type="text" 
                  id='passwordInput' 
                  className=' p-2 rounded-md border-none outline-none focus:outline-slate-400 focus:outline-2'
                />
            </div>
            <button 
              className=' w-full px-4 py-2 border-2 border-slate-500 font-bold text-center text-lg rounded-md'
              onClick={(e) => (handelSubmit(e))}
            >
              Login
            </button>
            <div>{user?.email}</div>
          </form>
          <div className='p-4 w-[80%] min-w-[340px]'>
            <Link to="http://localhost:8080/auth/google">
            <button 
              className=' w-full px-4 py-[6px] bg-white  font-bold text-center text-lg rounded-md flex items-center justify-center gap-4 hover:bg-gray-200'
            >
              <img src="/google.png" alt="" className=' w-8' />
              Login with Google 
            </button>
            </Link>
          </div>
        </div>
        <div className=' h-full hidden md:basis-1/2 w-full md:flex md:items-center justify-center'>
          right
        </div>
      </div>
    </div>
  )
}

export default Login