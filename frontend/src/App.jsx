import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Game from './pages/Game'
import Login from './pages/Login'
import { useUser } from './context/UserContext'


function App() {
  const {user, setUser} = useUser();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/game" element={user ? <Game /> : <Navigate to="/login" />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
