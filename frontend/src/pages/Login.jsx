import React, { useState } from 'react'
import { useUser } from '../context/UserContext'
import { Link, useNavigate } from 'react-router-dom';
import FloatingMatrix from '../components/animations/FloatingMatrix';

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
      <div className='w-full md:w-[800px] h-full md:h-[500px] p-4 rounded-2xl flex items-center justify-center bg-indigo-100 '>
        <div className=' w-full h-full md:basis-1/2 border-2 border-indigo-500 rounded-l-lg flex flex-col items-center justify-center bg-indigo-100'>
          
          <h1 className=' text-3xl font-semibold text-gray-600'>Login to</h1>
          <h1 className=' text-4xl font-bold text-indigo-600 mb-3'> Bingo Master</h1>
          <p
            className=' text-gray-500 text-center w-[75%] mb-5' 
          >We don't want you to remember multiple passswords so simply login using google </p>
          <form className=' p-4 w-[80%] min-w-[340px] hidden'>
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
              <img 
                src="/google.png" alt="" className=' w-8' />
              Login with Google 
            </button>
            </Link>
          </div>
        </div>
        <div className=' h-full hidden md:basis-1/2 w-full md:flex md:items-center justify-center bg-white border-2 border-indigo-500 rounded-r-lg border-l-0'>
          <img 
            src="./bingo.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Login