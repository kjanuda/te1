import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trash2, Send, AlertCircle } from 'lucide-react';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Load notices from localStorage on initial render
  useEffect(() => {
    const savedNotices = localStorage.getItem('noticeBoardData');
    if (savedNotices) {
      setNotices(JSON.parse(savedNotices));
    } else {
      // Initial demo data if nothing in localStorage
      const mockNotices = [
        {
          id: 1,
          title: 'Staff Meeting',
          content: 'Staff meeting tomorrow at 2 PM in the main hall',
          author: 'Principal',
          createdAt: '2023-05-15T10:00:00',
          scheduledFor: '2023-05-15T10:00:00',
          expiresAt: '2023-05-17T16:00:00'
        },
        {
          id: 2,
          title: 'Grade 10 Papers',
          content: 'Grade 10 papers need to be submitted by Friday',
          author: 'Vice Principal',
          createdAt: '2023-05-14T08:30:00',
          scheduledFor: '2023-05-14T09:00:00',
          expiresAt: '2023-05-19T17:00:00'
        },
      ];
      setNotices(mockNotices);
      localStorage.setItem('noticeBoardData', JSON.stringify(mockNotices));
    }
  }, []);

  // Save to localStorage whenever notices change
  useEffect(() => {
    if (notices.length > 0) {
      localStorage.setItem('noticeBoardData', JSON.stringify(notices));
    }
  }, [notices]);

  // Update current time every minute and check for expired notices
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
      // Check for expired notices
      cleanupExpiredNotices();
    }, 60000);
    
    return () => clearInterval(timer);
  }, [notices]);

  // Clean up expired notices
  const cleanupExpiredNotices = () => {
    const now = new Date();
    const activeNotices = notices.filter(notice => {
      const expiryDate = new Date(notice.expiresAt);
      return expiryDate > now;
    });
    
    if (activeNotices.length !== notices.length) {
      setNotices(activeNotices);
    }
  };

  // Format date for display
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if notice should be visible
  const isNoticeVisible = (notice) => {
    const now = new Date();
    const scheduledFor = new Date(notice.scheduledFor);
    const expiresAt = new Date(notice.expiresAt);
    
    return scheduledFor <= now && expiresAt > now;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (newNotice.trim() && noticeTitle.trim() && expiryDate) {
      const now = new Date();
      let scheduledFor = now;
      
      // If scheduling for future
      if (scheduledDate) {
        scheduledFor = new Date(`${scheduledDate}T${scheduledTime || '00:00'}`);
      }
      
      // Set expiry date/time
      const expiresAt = new Date(`${expiryDate}T${expiryTime || '23:59'}`);
      
      const notice = {
        id: Date.now(),
        title: noticeTitle,
        content: newNotice,
        author: 'You',
        createdAt: now.toISOString(),
        scheduledFor: scheduledFor.toISOString(),
        expiresAt: expiresAt.toISOString()
      };
      
      const updatedNotices = [notice, ...notices];
      setNotices(updatedNotices);
      
      // Reset form
      setNewNotice('');
      setNoticeTitle('');
      setScheduledDate('');
      setScheduledTime('');
      setExpiryDate('');
      setExpiryTime('');
    }
  };

  // Delete a notice
  const deleteNotice = (id) => {
    const updatedNotices = notices.filter(notice => notice.id !== id);
    setNotices(updatedNotices);
    
    // Update localStorage
    if (updatedNotices.length === 0) {
      localStorage.removeItem('noticeBoardData');
    } else {
      localStorage.setItem('noticeBoardData', JSON.stringify(updatedNotices));
    }
  };
  
  // Get visible notices
  const visibleNotices = notices.filter(isNoticeVisible);

  // Clear all notices
  const clearAllNotices = () => {
    if (confirm('Are you sure you want to delete all notices?')) {
      setNotices([]);
      localStorage.removeItem('noticeBoardData');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <AlertCircle className="text-blue-600 mr-2" size={28} />
          <h1 className="text-2xl font-bold text-blue-800">Notice Board</h1>
        </div>
        {notices.length > 0 && (
          <button 
            onClick={clearAllNotices} 
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear All Notices
          </button>
        )}
      </div>
      
      {/* New Notice Form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Post New Notice</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              placeholder="Notice Title"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              className="w-full border rounded p-2"
              rows="3"
              placeholder="Enter notice content..."
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>Schedule Date (optional)</span>
                </div>
              </label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  <span>Schedule Time</span>
                </div>
              </label>
              <input
                type="time"
                className="w-full border rounded p-2"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1 text-red-500" />
                  <span>Expiry Date (required)</span>
                </div>
              </label>
              <input
                type="date"
                className="w-full border rounded p-2"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                <div className="flex items-center">
                  <Clock size={16} className="mr-1 text-red-500" />
                  <span>Expiry Time</span>
                </div>
              </label>
              <input
                type="time"
                className="w-full border rounded p-2"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <Send size={16} className="mr-2" />
            Post Notice
          </button>
        </form>
      </div>
      
      {/* Notices List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Current Notices</h2>
          <div className="text-sm text-blue-600">
            {visibleNotices.length} of {notices.length} notices visible
          </div>
        </div>
        
        {visibleNotices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No active notices to display
          </div>
        ) : (
          <ul>
            {visibleNotices.map((notice, index) => (
              <li key={notice.id} className={`p-4 ${index < visibleNotices.length - 1 ? 'border-b' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <AlertCircle size={18} className="text-blue-600 mr-2" />
                      <h3 className="font-medium text-lg">{notice.title}</h3>
                    </div>
                    <p className="mb-2">{notice.content}</p>
                    <div className="text-sm text-gray-500">
                      <p>Posted by {notice.author} • {formatDateTime(notice.createdAt)}</p>
                      <p className="text-red-500">Expires: {formatDateTime(notice.expiresAt)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteNotice(notice.id)}
                    className="ml-2 p-1 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Hidden notices alert */}
      {notices.length > visibleNotices.length && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800">
          {notices.length - visibleNotices.length} notice(s) are scheduled for future display or have expired
        </div>
      )}
      
      {/* Current time display */}
      <div className="mt-4 text-sm text-gray-500 text-right">
        Current time: {currentDateTime.toLocaleString()}
      </div>
      
      {/* Local storage indicator */}
      <div className="mt-2 text-xs text-green-600 text-right">
        Data saved locally - will persist after page reload
      </div>
    </div>
  );
}