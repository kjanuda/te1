import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Attendance from './components/Attendance';
import About from './components/About';
import Preloader from './components/Preloader';
import Login from './components/Logging';
import Signin from './components/Signin';
import Register from './components/Register';
import Profile from './components/profile';
import Dashboard from './components/Dashboard';
import NoticeBoard from './components/NoticeBoard';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoading) return <Preloader />;
  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<Signin onLogin={handleLogin} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/NoticeBoard" element={<NoticeBoard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
