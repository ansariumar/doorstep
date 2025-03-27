import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search, IndianRupee, X } from 'lucide-react';
import Navbar from '../components/Navbar';

interface Service {
  _id: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  available: boolean;
  category: string;
}

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{message: string, isError: boolean} | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/service/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      
      const data = await response.json();
      setServices(data.services);
    } catch (err) {
      setError('Error fetching services. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/service/search?query=${searchQuery}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setServices(data.services);
    } catch (err) {
      setError('Error searching services. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      fetchServices();
    }
  };

  const handleBookService = async (serviceId: string) => {
    try {
      if (!bookingDate || !bookingTime) {
        setBookingStatus({
          message: 'Please select both date and time for your booking',
          isError: true
        });
        return;
      }

      setBookingStatus(null);
      const response = await fetch(`http://localhost:4000/api/booking/book/${serviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          date: bookingDate,
          time: bookingTime
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book service');
      }
      
      const data = await response.json();
      setBookingStatus({
        message: 'Service booked successfully!',
        isError: false
      });
    } catch (err) {
      console.error(err);
      setBookingStatus({
        message: err instanceof Error ? err.message : 'Error booking service',
        isError: true
      });
    }
  };

  const openServiceModal = (service: Service) => {
    setSelectedService(service);
    setShowModal(true);
    setBookingStatus(null);
    setBookingDate('');
    setBookingTime('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setBookingStatus(null);
    setBookingDate('');
    setBookingTime('');
  };

  return (
    <div className="min-h-screen bg-[#0f1118] text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Available Services</h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 rounded-l bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="Search services..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r"
            >
              Search
            </button>
          </form>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchServices}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.length > 0 ? (
              services.map((service) => (
                <div 
                  key={service._id} 
                  className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h2 className="text-xl font-bold mb-2">{service.serviceName}</h2>
                  <p className="text-gray-300 mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center mb-2">
                    <IndianRupee className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-semibold">{service.price} per hour</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{service.duration} minutes</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      service.available 
                        ? 'bg-green-900/30 text-green-400' 
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {service.available ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="text-sm text-gray-400">{service.category}</span>
                  </div>
                  
                  {service.available && (
                    <button
                      onClick={() => openServiceModal(service)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                    >
                      Book Service
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-400">No services found. Try a different search term.</p>
              </div>
            )}
          </div>
        )}

        {/* Service Booking Modal */}
        {showModal && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedService.serviceName}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300">{selectedService.description}</p>
              </div>
              
              <div className="flex items-center mb-3">
                <IndianRupee className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-semibold">{selectedService.price} per hour</span>
              </div>
              
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span>{selectedService.duration} minutes</span>
              </div>
              
              <div className="mb-5">
                <span className="text-sm text-gray-400">Category: {selectedService.category}</span>
              </div>
              
              {/* Date and Time Selection */}
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Select Date</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-gray-300 mb-2">Select Time</label>
                <input 
                  type="time" 
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              {bookingStatus && (
                <div className={`p-3 rounded mb-4 ${bookingStatus.isError ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>
                  {bookingStatus.message}
                </div>
              )}
              
              <button
                onClick={() => handleBookService(selectedService._id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
