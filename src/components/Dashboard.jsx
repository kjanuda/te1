import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { Calendar, Clock, Users, BookOpen, CheckSquare, Settings, Bell, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const upcomingClasses = [
    { id: 1, name: 'Mathematics 101', time: '10:30 AM', students: 28 },
    { id: 2, name: 'Physics Lab', time: '1:15 PM', students: 22 },
    { id: 3, name: 'English Literature', time: '3:00 PM', students: 25 }
  ];

  const attendanceSummary = {
    present: 76,
    absent: 12,
    excused: 8,
    total: 96
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-blue-800 text-white p-6"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">
              {user?.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{user?.email.split('@')[0]}</h3>
            <p className="text-blue-200 text-sm">Teacher</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${activeTab === 'overview' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <Calendar size={20} />
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${activeTab === 'attendance' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <CheckSquare size={20} />
            <span>Attendance</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('classes')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${activeTab === 'classes' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <BookOpen size={20} />
            <span>Classes</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('students')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${activeTab === 'students' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <Users size={20} />
            <span>Students</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="absolute bottom-6 left-6">
          <button 
            onClick={logout}
            className="flex items-center space-x-3 w-full p-3 rounded-lg text-blue-200 hover:bg-blue-900 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-4 shadow flex justify-between items-center"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'attendance' && 'Attendance Management'}
            {activeTab === 'classes' && 'Class Schedule'}
            {activeTab === 'students' && 'Student Management'}
            {activeTab === 'settings' && 'Account Settings'}
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">{currentDate}</div>
            <button className="relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </motion.div>

        {/* Dashboard Content - Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Card 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Today's Classes</h3>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen size={24} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{upcomingClasses.length}</p>
                <p className="text-green-500 text-sm">All scheduled for today</p>
              </motion.div>

              {/* Card 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Students Present</h3>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users size={24} className="text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{attendanceSummary.present}/{attendanceSummary.total}</p>
                <p className="text-green-500 text-sm">{Math.round((attendanceSummary.present / attendanceSummary.total) * 100)}% attendance rate</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 font-medium">Next Class</h3>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock size={24} className="text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{upcomingClasses[0].time}</p>
                <p className="text-purple-500 text-sm">{upcomingClasses[0].name}</p>
              </motion.div>
            </div>

            {/* Upcoming Classes */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h3 className="text-xl font-semibold mb-4">Today's Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 text-gray-600">Class Name</th>
                      <th className="text-left p-3 text-gray-600">Time</th>
                      <th className="text-left p-3 text-gray-600">Students</th>
                      <th className="text-left p-3 text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingClasses.map(classItem => (
                      <tr key={classItem.id} className="border-t">
                        <td className="p-3">{classItem.name}</td>
                        <td className="p-3">{classItem.time}</td>
                        <td className="p-3">{classItem.students} students</td>
                        <td className="p-3">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                            Take Attendance
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Attendance Summary */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-xl font-semibold mb-4">Attendance Summary</h3>
              <div className="flex flex-wrap gap-4">
                <div className="bg-green-50 rounded-lg p-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium">Present</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{Math.round((attendanceSummary.present / attendanceSummary.total) * 100)}%</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{attendanceSummary.present} students</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-medium">Absent</span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">{Math.round((attendanceSummary.absent / attendanceSummary.total) * 100)}%</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{attendanceSummary.absent} students</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-600 font-medium">Excused</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{Math.round((attendanceSummary.excused / attendanceSummary.total) * 100)}%</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">{attendanceSummary.excused} students</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 flex items-center justify-center h-full"
          >
            <div className="text-center p-10 max-w-md">
              <div className="bg-blue-100 p-6 rounded-full inline-block mb-4">
                {activeTab === 'attendance' && <CheckSquare size={40} className="text-blue-600" />}
                {activeTab === 'classes' && <BookOpen size={40} className="text-blue-600" />}
                {activeTab === 'students' && <Users size={40} className="text-blue-600" />}
                {activeTab === 'settings' && <Settings size={40} className="text-blue-600" />}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {activeTab === 'attendance' && 'Attendance Management'}
                {activeTab === 'classes' && 'Class Schedule'}
                {activeTab === 'students' && 'Student Management'}
                {activeTab === 'settings' && 'Account Settings'}
              </h2>
              <p className="text-gray-600">This section is under development. Please check back later!</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;