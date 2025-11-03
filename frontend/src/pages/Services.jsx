import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Estados de paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9); // 9 para grid de 3x3
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Estado de formulario para crear
    const [formData, setFormData] = useState({
        name: '',
        hourlyRateUsd: '',
    });

    // Estado de formulario para editar
    const [editData, setEditData] = useState({
        name: '',
        hourlyRateUsd: '',
    });

    useEffect(() => {
        fetchServices();
    }, [currentPage, pageSize]);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Services', {
                params: {
                    pageNumber: currentPage,
                    pageSize: pageSize
                }
            });

            setServices(response.data.items || []);
            setTotalItems(response.data.totalCount || 0);
            setTotalPages(response.data.totalPages || Math.ceil((response.data.totalCount || 0) / pageSize));

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

    const handleEdit = async (e) => {
        e.preventDefault();

        if (!editData.name || !editData.hourlyRateUsd) {
            toast.error('Please fill in all fields');
            return;
        }

        if (parseFloat(editData.hourlyRateUsd) < 0) {
            toast.error('Hourly rate must be a positive number');
            return;
        }

        try {
            await api.put(`/Services/${selectedService.id}`, {
                name: editData.name,
                hourlyRateUsd: parseFloat(editData.hourlyRateUsd),
            });
            toast.success('Service updated successfully! ✅');
            setShowEditModal(false);
            setSelectedService(null);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error(error.response?.data || 'Failed to update service');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await api.delete(`/Services/${id}`);
            toast.success('Service deleted successfully!');

            // Si al eliminar queda la página vacía y no es la primera, retroceder
            if (services.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchServices();
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service');
        }
    };

    const openEditModal = (service) => {
        setSelectedService(service);
        setEditData({
            name: service.name,
            hourlyRateUsd: service.hourlyRateUsd.toString(),
        });
        setShowEditModal(true);
    };

    // Paginación
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (size) => {
        setPageSize(Number(size));
        setCurrentPage(1); // Reiniciar a la primera página al cambiar tamaño
    };

    // Generar arreglo de páginas para mostrar
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
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

                {/* Search and Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search services by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="6">6 per page</option>
                        <option value="9">9 per page</option>
                        <option value="12">12 per page</option>
                        <option value="24">24 per page</option>
                    </select>
                </div>

                {/* Info Bar */}
                {!loading && (
                    <div className="mb-4 text-sm text-gray-600">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} services
                    </div>
                )}

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
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(service)}
                                            className="text-purple-500 hover:text-purple-700 transition"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id, service.name)}
                                            className="text-red-500 hover:text-red-700 transition"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
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

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-3 py-2 rounded-lg ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* First Page */}
                            {currentPage > 3 && (
                                <>
                                    <button
                                        onClick={() => handlePageChange(1)}
                                        className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 border"
                                    >
                                        1
                                    </button>
                                    {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                                </>
                            )}

                            {/* Page Numbers */}
                            {getPageNumbers().map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg ${
                                        page === currentPage
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Last Page */}
                            {currentPage < totalPages - 2 && (
                                <>
                                    {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                                    <button
                                        onClick={() => handlePageChange(totalPages)}
                                        className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-100 border"
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-2 rounded-lg ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
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

            {/* Edit Modal */}
            {showEditModal && selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Service</h2>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (USD)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editData.hourlyRateUsd}
                                    onChange={(e) => setEditData({...editData, hourlyRateUsd: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedService(null);
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}