import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Home, 
  Calendar, 
  Info, 
  BarChart3, 
  Menu, 
  X, 
  LogOut, 
  User
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { username, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
          ${isActive 
            ? 'text-orange-600 bg-orange-50 font-medium' 
            : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50/50'}
        `}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link 
              to="/"
              className="text-2xl font-bold text-orange-600 flex items-center gap-2 relative group"
            >
              <Calendar className="w-6 h-6" strokeWidth={2.5} />
              <span>Teacher Attendance</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/attendance" icon={Calendar}>Attendance</NavLink>
            <NavLink to="/dashboard" icon={BarChart3}>Dashboard</NavLink>
            <NavLink to="/about" icon={Info}>About</NavLink>
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
                className="border border-gray-300 pl-9 pr-3 py-1.5 rounded-full text-sm w-48 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
              />
              <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
            </form>

            {/* Time Display */}
            <div className="text-sm text-gray-500 flex items-center">
              <div className="hidden lg:block">
                <span className="font-medium">{currentTime.toLocaleDateString()}</span>
                <span className="mx-1">·</span>
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* User Menu */}
            {username ? (
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-700 mr-2">{username}</span>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 transition duration-200"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
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
        <div 
          className={`md:hidden mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col py-2 space-y-1">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/attendance" icon={Calendar}>Attendance</NavLink>
            <NavLink to="/dashboard" icon={BarChart3}>Dashboard</NavLink>
            <NavLink to="/about" icon={Info}>About</NavLink>
          </div>
          
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 pl-9 pr-3 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          </form>
          
          {/* Mobile User Menu */}
          {username ? (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition duration-200"
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
          <div className="text-xs text-center mt-3 text-gray-500">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;