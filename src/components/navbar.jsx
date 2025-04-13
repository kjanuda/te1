import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import useAuthStore from '../store/useAuthStore'; // import Zustand store
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // You can connect this with filtering logic later
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
      {/* Logo */}
      <motion.div
        className="text-2xl font-bold text-orange-600"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Teacher Attendance
      </motion.div>

      {/* Navigation Links */}
      <div className="flex flex-col sm:flex-row items-center gap-3 text-gray-700 text-base">
        <Link to="/" className="hover:text-orange-600 transition duration-200">Home</Link>
        <Link to="/attendance" className="hover:text-orange-600 transition duration-200">Attendance</Link>
        <Link to="/about" className="hover:text-orange-600 transition duration-200">About</Link>
        <Link to="/Dashboard" className="hover:text-orange-600 transition duration-200">Dashboard</Link>
        
      </div>

      {/* Search Bar + Button */}
      <div className="flex items-center w-full sm:w-auto gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded-lg text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-200"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Date and Time */}
      <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </div>
    </nav>
  );
};

export default Navbar;
