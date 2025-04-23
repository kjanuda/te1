import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  Calendar,
  Info,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Sun,
  Moon,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // TODO: Implement actual search logic
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
          ${
            isActive
              ? 'text-orange-600 bg-orange-100 font-medium'
              : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-200 dark:hover:bg-orange-900/50'
          }
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon
          className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-gray-500 dark:text-gray-400'}`}
        />
        <span>{children}</span>
      </Link>
    );
  };

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/attendance', icon: Calendar, label: 'Attendance' },
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <nav className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg px-4 py-3 sticky top-0 z-50 w-full">
      <div className="w-full">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Link
              to="/"
              className="text-2xl font-bold text-orange-600 flex items-center gap-2 relative group"
              aria-label="Teacher Attendance Home"
            >
              <Calendar className="w-6 h-6" strokeWidth={2.5} />
              <span>Teacher Attendance</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} icon={link.icon}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 pl-9 pr-3 py-1.5 rounded-full text-sm w-48 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-700 dark:text-gray-200"
                aria-label="Search"
              />
              <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400 dark:text-gray-500" />
            </form>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            {/* Time Display */}
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <div className="hidden lg:block">
                <span className="font-medium">{currentTime.toLocaleDateString()}</span>
                <span className="mx-1">·</span>
                <span>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* User Menu */}
            {username ? (
              <div className="flex items-center gap-1 relative group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600"
                >
                  <User className="w-4 h-4" />
                </motion.div>
                <span className="text-sm text-gray-700 dark:text-gray-200 mr-2">{username}</span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition duration-200"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                {/* Notification Badge */}
                <motion.div
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  2
                </motion.div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden mt-3 overflow-hidden"
            >
              <div className="flex flex-col py-2 space-y-1">
                {navLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} icon={link.icon}>
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 my-3" />

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 pl-9 pr-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-gray-200"
                  aria-label="Search"
                />
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />
              </form>

              {/* Mobile User Menu */}
              {username ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 transition duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition duration-200 flex items-center justify-center"
                >
                  Login
                </Link>
              )}

              {/* Mobile Time Display */}
              <div className="text-xs text-center mt-3 text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;