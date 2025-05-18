import { Routes, Route } from "react-router-dom"
import Navbar from "./components/navbar"
import HomePage from "./pages/home"
import LoginPage from './pages/login'
import SignupPage from "./pages/signup"
import RegisterPage from "./pages/register"
import AdminDashboard from "./pages/admin"
import { Toaster } from "./components/ui/sonner" 

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
       <Toaster />
    </div>
  )
}

export default App
