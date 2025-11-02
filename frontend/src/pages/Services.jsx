import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        hourlyRateUsd: '',
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await api.get('/Services', {
                params: { pageNumber: 1, pageSize: 50 }
            });
            setServices(response.data.items || []);
            toast.success(`Loaded ${response.data.items?.length || 0} services`);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.hourlyRateUsd) {
            toast.error('Please fill in all fields');
            return;
        }

        if (parseFloat(formData.hourlyRateUsd) < 0) {
            toast.error('Hourly rate must be a positive number');
            return;
        }

        try {
            await api.post('/Services', {
                name: formData.name,
                hourlyRateUsd: parseFloat(formData.hourlyRateUsd),
            });
            toast.success('Service created successfully! 🎉');
            setShowCreateModal(false);
            setFormData({ name: '', hourlyRateUsd: '' });
            fetchServices();
        } catch (error) {
            console.error('Error creating service:', error);
            toast.error(error.response?.data || 'Failed to create service');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await api.delete(`/Services/${id}`);
            toast.success('Service deleted successfully!');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service');
        }
    };

    const filteredServices = services.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
                        <p className="text-gray-600 mt-1">Manage all available services</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
                    >
                        + Create Service
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search services by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading services...</p>
                    </div>
                )}

                {/* Services Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(service.id, service.name)}
                                        className="text-red-500 hover:text-red-700 transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-3">{service.name}</h3>
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-4">
                                    <p className="text-sm opacity-90">Hourly Rate</p>
                                    <p className="text-2xl font-bold">${service.hourlyRateUsd.toFixed(2)} USD</p>
                                </div>
                                {service.countries && service.countries.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs font-semibold text-gray-700 mb-2">Available in:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {service.countries.map((country, idx) => (
                                                <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {country.name}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredServices.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-600">No services found</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Service</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Cloud Infrastructure Management"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.hourlyRateUsd}
                                    onChange={(e) => setFormData({...formData, hourlyRateUsd: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="150.00"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}