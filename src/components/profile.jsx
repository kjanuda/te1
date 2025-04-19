import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Generate time ranges like "7:30 AM - 8:10 AM"
const generateTimeRanges = () => {
  const ranges = [];
  let hour = 7;
  let minute = 30;

  while (hour < 13 || (hour === 13 && minute <= 30)) {
    let startHour = hour;
    let startMinute = minute;

    minute += 40;
    if (minute >= 60) {
      hour += 1;
      minute -= 60;
    }

    let endHour = hour;
    let endMinute = minute;

    const formatTime = (h, m) => {
      const suffix = h >= 12 ? 'PM' : 'AM';
      const formattedHour = h > 12 ? h - 12 : h;
      return `${formattedHour}:${m.toString().padStart(2, '0')} ${suffix}`;
    };

    ranges.push(`${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`);
  }

  return ranges;
};

const SUBJECTS = [
  'ICT', 
  'SINHALA', 
  'MATHEMATICS', 
  'HISTORY', 
  'ENGLISH', 
  'BUDDA DHARMAYA', 
  'ART', 
  'COMMERCE', 
  'SCIENCE'
];

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nic: '',
    name: '',
    gender: '',
    subject: '',
    time: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
    },
    weekdays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
    },
    robot: false,
  });

  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);
  const times = generateTimeRanges();

  // Fetch user data if available
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get user ID from local storage or context
        const currentUserId = localStorage.getItem('userId');
        
        if (currentUserId) {
          setUserId(currentUserId);
          setIsLoading(true);
          
          const response = await axios.get(`/api/users/${currentUserId}`);
          if (response.data) {
            setFormData(response.data);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Could not load profile data');
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name in formData.time) {
      setFormData((prev) => ({
        ...prev,
        time: { ...prev.time, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleToggleDay = (day) => {
    setFormData((prevData) => ({
      ...prevData,
      weekdays: {
        ...prevData.weekdays,
        [day]: !prevData.weekdays[day],
      },
    }));
    
    if (errors.weekdays) {
      setErrors(prev => ({ ...prev, weekdays: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Basic validations
    if (!formData.nic) {
      newErrors.nic = 'NIC is required.';
    } else if (!/^\d{9}[vVxX]$|^\d{12}$/.test(formData.nic)) {
      newErrors.nic = 'Enter a valid NIC number.';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }
    
    if (!formData.gender) newErrors.gender = 'Please select a gender.';
    if (!formData.subject) newErrors.subject = 'Please select a subject.';
    if (!formData.robot) newErrors.robot = 'Please confirm you are not a robot.';

    const selectedDays = Object.values(formData.weekdays).filter(Boolean);
    if (selectedDays.length === 0) {
      newErrors.weekdays = 'Please select at least one weekday.';
    }

    // Validate selected time slots for each selected day
    WEEKDAYS.forEach(day => {
      if (formData.weekdays[day] && !formData.time[day]) {
        newErrors[day] = `Please select time for ${day}`;
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        
        // Update or create user profile in MongoDB
        const url = userId 
          ? `/api/users/${userId}` 
          : '/api/users';
        
        const method = userId ? 'put' : 'post';
        const response = await axios[method](url, formData);
        
        if (!userId && response.data._id) {
          // Store user ID if it's a new profile
          localStorage.setItem('userId', response.data._id);
          setUserId(response.data._id);
        }
        
        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error saving profile:', error);
        toast.error('Failed to update profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with wave design */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0 200 C 100 100 200 100 500 200 C 800 300 900 100 1000 200 L 1000 1000 L 0 1000 Z" fill="white" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 relative z-10">
            {userId ? 'Update Your Profile' : 'Create Profile'}
          </h2>
          <p className="text-blue-50 text-sm sm:text-base relative z-10">
            Complete your profile to personalize your experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NIC Number */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-2">
                NIC Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="Enter your NIC number"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                  ${errors.nic ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'}`}
              />
              {errors.nic && <p className="text-red-500 text-sm mt-1">{errors.nic}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                  ${errors.name ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'}`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                  ${errors.gender ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'}`}
              >
                <option value="">Select Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-gray-700 font-semibold text-sm mb-2">
                Select Subject <span className="text-red-500">*</span>
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                  ${errors.subject ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'}`}
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
            </div>
          </div>

          {/* Weekdays Selection */}
          <div>
            <label className="block text-gray-700 font-semibold text-sm mb-3">
              Select Available Weekdays <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {WEEKDAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleToggleDay(day)}
                  className={`px-4 py-2.5 rounded-full capitalize transition text-sm font-medium
                    ${formData.weekdays[day]
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.weekdays && (
              <p className="text-red-500 text-sm mt-2">{errors.weekdays}</p>
            )}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WEEKDAYS.map((day) =>
              formData.weekdays[day] ? (
                <div key={day} className="transition-all duration-300">
                  <label className="block text-gray-700 font-semibold text-sm mb-2 capitalize">
                    {day} Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    name={day}
                    value={formData.time[day]}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                      ${errors[day] ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'}`}
                  >
                    <option value="">Select Time</option>
                    {times.map((timeRange) => (
                      <option key={timeRange} value={timeRange}>
                        {timeRange}
                      </option>
                    ))}
                  </select>
                  {errors[day] && <p className="text-red-500 text-sm mt-1">{errors[day]}</p>}
                </div>
              ) : null
            )}
          </div>

          {/* Not a robot checkbox */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="robot"
                name="robot"
                checked={formData.robot}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
              <label htmlFor="robot" className="text-gray-700 cursor-pointer">
                I'm not a robot
              </label>
            </div>
            {errors.robot && <p className="text-red-500 text-sm mt-2">{errors.robot}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
              text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md 
              flex justify-center items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : userId ? (
              'Update Profile'
            ) : (
              'Create Profile'
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default ProfilePage;