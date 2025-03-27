import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { X } from 'lucide-react';

interface Booking {
  _id: string;
  serviceId: {
    _id: string;
    serviceName: string;
    description: string;
    price: number;
    duration: number;
    available: boolean;
    category: string;
  };
  workerId: string;
  status: string;
  date: string;
}

interface User {
  _id: string;
  name: string;
  userID: string;
  phone: string;
  bookings: Booking[];
  createdAt: string;
  updatedAt: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{success: boolean, message: string} | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/profile/my-user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError('Error fetching profile. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-900/30 text-green-400';
      case 'Pending':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'Cancelled':
        return 'bg-red-900/30 text-red-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };

  const handleDeleteClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBookingId) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/booking/delete/${selectedBookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      setDeleteStatus(data);

      if (data.success) {
        // Update the user state to remove the deleted booking
        if (user) {
          setUser({
            ...user,
            bookings: user.bookings.filter(booking => booking._id !== selectedBookingId)
          });
        }
        
        // Close the modal after a short delay
        setTimeout(() => {
          setShowDeleteModal(false);
          setDeleteStatus(null);
        }, 1500);
      }
    } catch (err) {
      setDeleteStatus({
        success: false,
        message: 'An error occurred while deleting the booking.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1118] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-red-900/30 text-red-400 rounded-lg p-4">
            <p>{error}</p>
          </div>
        ) : user ? (
          <>
            <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
              <h1 className="text-3xl font-bold mb-6 text-blue-500">User Profile</h1>
              <div className="space-y-4">
                <div>
                  <h2 className="text-gray-400 text-sm">Name</h2>
                  <p className="text-xl font-semibold">{user.name}</p>
                </div>
                <div>
                  <h2 className="text-gray-400 text-sm">Phone</h2>
                  <p className="text-xl font-semibold">{user.phone}</p>
                </div>
                <div>
                  <h2 className="text-gray-400 text-sm">Member Since</h2>
                  <p className="text-xl font-semibold">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-blue-500">My Bookings</h2>
              
              {user.bookings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>You haven't made any bookings yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.bookings.map((booking) => (
                    <div key={booking._id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{booking.serviceId.serviceName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">{booking.serviceId.description}</p>
                      <div className="flex justify-between items-center text-sm text-gray-400">
                        <div className="flex flex-col sm:flex-row sm:space-x-4">
                          <span>Price: ₹{booking.serviceId.price} per hour</span>
                          <span>Duration: {booking.serviceId.duration} minutes</span>
                          <span>Date: {new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        {booking.status === 'Pending' && (
                          <button 
                            onClick={() => handleDeleteClick(booking._id)}
                            className="ml-4 bg-red-900/50 hover:bg-red-800 text-red-300 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">No user data found. Please log in again.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Cancel Booking</h3>
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteStatus(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {deleteStatus ? (
              <div className={`p-4 rounded-lg ${deleteStatus.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                <p>{deleteStatus.message}</p>
              </div>
            ) : (
              <>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                  >
                    Yes, Cancel Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
