import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function Providers() {
    const [providers, setProviders] = useState([]);
    const [services, setServices] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCustomFieldModal, setShowCustomFieldModal] = useState(false);
    const [showAssignServiceModal, setShowAssignServiceModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9); // 9 para grid de 3x3
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Form states
    const [formData, setFormData] = useState({ nit: '', name: '', email: '' });
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        customFields: [],
        services: []
    });
    const [customFieldData, setCustomFieldData] = useState({ fieldName: '', fieldValue: '' });
    const [assignServiceData, setAssignServiceData] = useState({
        serviceId: '',
        countryCodes: [],
    });

    useEffect(() => {
        fetchProviders();
        fetchServices();
        fetchCountries();
    }, [currentPage, pageSize]);

    const fetchProviders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/Providers', {
                params: {
                    pageNumber: currentPage,
                    pageSize: pageSize
                }
            });

            setProviders(response.data.items || []);
            setTotalItems(response.data.totalCount || 0);
            setTotalPages(response.data.totalPages || Math.ceil((response.data.totalCount || 0) / pageSize));

            toast.success(`Loaded ${response.data.items?.length || 0} providers`);
        } catch (error) {
            console.error('Error fetching providers:', error);
            toast.error('Failed to load providers');
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await api.get('/Services', {
                params: { pageNumber: 1, pageSize: 100 } // Traer más servicios
            });
            setServices(response.data.items || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await api.get('/Countries');
            setCountries(response.data || []);
        } catch (error) {
            console.error('Error fetching countries:', error);
            toast.error('Failed to load countries');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        if (!formData.nit || !formData.name || !formData.email) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            await api.post('/Providers', formData);
            toast.success('Provider created successfully! 🎉');
            setShowCreateModal(false);
            setFormData({ nit: '', name: '', email: '' });
            fetchProviders();
        } catch (error) {
            console.error('Error creating provider:', error);
            toast.error(error.response?.data || 'Failed to create provider');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        if (!editData.name || !editData.email) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            // Actualizar información básica del proveedor (solo name y email)
            await api.put(`/Providers/${selectedProvider.id}`, {
                name: editData.name,
                email: editData.email
            });

            toast.success('Provider updated successfully! ✅');
            setShowEditModal(false);
            setSelectedProvider(null);
            fetchProviders();
        } catch (error) {
            console.error('Error updating provider:', error);
            toast.error(error.response?.data || 'Failed to update provider');
        }
    };

    const handleAddCustomField = async (e) => {
        e.preventDefault();

        if (!customFieldData.fieldName || !customFieldData.fieldValue) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            await api.post(`/Providers/${selectedProvider.id}/custom-fields`, customFieldData);
            toast.success('Custom field added successfully! 🏷️');
            setShowCustomFieldModal(false);
            setCustomFieldData({ fieldName: '', fieldValue: '' });
            setSelectedProvider(null);
            fetchProviders();
        } catch (error) {
            console.error('Error adding custom field:', error);
            toast.error(error.response?.data || 'Failed to add custom field');
        }
    };

    // Nota: No hay endpoints para eliminar custom fields o servicios individualmente
    // Solo se pueden agregar nuevos

    const handleAssignService = async (e) => {
        e.preventDefault();

        if (!assignServiceData.serviceId) {
            toast.error('Please select a service');
            return;
        }

        if (assignServiceData.countryCodes.length === 0) {
            toast.error('Please select at least one country');
            return;
        }

        try {
            await api.post(
                `/Providers/${selectedProvider.id}/services/${assignServiceData.serviceId}`,
                assignServiceData.countryCodes
            );
            toast.success('Service assigned successfully! 🌍');
            setShowAssignServiceModal(false);
            setAssignServiceData({ serviceId: '', countryCodes: [] });
            setSelectedProvider(null);
            fetchProviders();
        } catch (error) {
            console.error('Error assigning service:', error);
            toast.error(error.response?.data || 'Failed to assign service');
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
            return;
        }

        try {
            await api.delete(`/Providers/${id}`);
            toast.success('Provider deleted successfully!');

            // Si al eliminar queda la página vacía y no es la primera, retroceder
            if (providers.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchProviders();
            }
        } catch (error) {
            console.error('Error deleting provider:', error);
            toast.error('Failed to delete provider');
        }
    };

    const openEditModal = (provider) => {
        setSelectedProvider(provider);
        setEditData({
            name: provider.name,
            email: provider.email,
            customFields: provider.customFields || [],
            services: provider.services || []
        });
        setShowEditModal(true);
    };

    const openCustomFieldModal = (provider) => {
        setSelectedProvider(provider);
        setShowCustomFieldModal(true);
    };

    const openAssignServiceModal = (provider) => {
        setSelectedProvider(provider);
        setShowAssignServiceModal(true);
    };

    const toggleCountry = (countryCode) => {
        setAssignServiceData(prev => ({
            ...prev,
            countryCodes: prev.countryCodes.includes(countryCode)
                ? prev.countryCodes.filter(c => c !== countryCode)
                : [...prev.countryCodes, countryCode]
        }));
    };

    // Paginación
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (size) => {
        setPageSize(Number(size));
        setCurrentPage(1); // Reset a primera página al cambiar tamaño
    };

    // Generar array de páginas para mostrar
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

    const filteredProviders = providers.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Providers</h1>
                        <p className="text-gray-600 mt-1">Manage all service providers</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition"
                    >
                        + Create Provider
                    </button>
                </div>

                {/* Search and Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, NIT or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} providers
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-600 mt-4">Loading providers...</p>
                    </div>
                )}

                {/* Providers Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProviders.map((provider) => (
                            <div key={provider.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(provider)}
                                            className="text-blue-500 hover:text-blue-700 transition"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(provider.id, provider.name)}
                                            className="text-red-500 hover:text-red-700 transition"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{provider.name}</h3>
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <p><span className="font-semibold">NIT:</span> {provider.nit}</p>
                                    <p><span className="font-semibold">Email:</span> {provider.email}</p>
                                </div>

                                {/* Custom Fields */}
                                {provider.customFields && provider.customFields.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs font-semibold text-gray-700 mb-2">Custom Fields:</p>
                                        {provider.customFields.map((field, idx) => (
                                            <p key={idx} className="text-xs text-gray-600">
                                                {field.fieldName}: {field.fieldValue}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Services Assigned */}
                                {provider.services && provider.services.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs font-semibold text-gray-700 mb-2">Assigned Services:</p>
                                        {provider.services.map((service, idx) => (
                                            <div key={idx} className="text-xs text-gray-600 mb-2 bg-green-50 p-2 rounded">
                                                <p className="font-semibold text-green-800">{service.name}</p>
                                                {service.countries && service.countries.length > 0 ? (
                                                    <p className="text-gray-600">
                                                        📍 {service.countries.map(c => c.name).join(', ')}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500 italic">No countries assigned</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-2 mt-4">
                                    <button
                                        onClick={() => openCustomFieldModal(provider)}
                                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                                    >
                                        + Add Custom Field
                                    </button>
                                    <button
                                        onClick={() => openAssignServiceModal(provider)}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition text-sm"
                                    >
                                        🌍 Assign Service
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProviders.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-600">No providers found</p>
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
                                            ? 'bg-blue-500 text-white'
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Provider</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">NIT</label>
                                <input
                                    type="text"
                                    value={formData.nit}
                                    onChange={(e) => setFormData({...formData, nit: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="900123456-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Provider Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="provider@example.com"
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
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Enhanced Edit Modal - Solo edita name y email */}
            {showEditModal && selectedProvider && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Provider</h2>

                        {/* NIT (No editable) */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">NIT (Not editable)</label>
                            <input
                                type="text"
                                value={selectedProvider.nit}
                                disabled
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500"
                            />
                        </div>

                        <form onSubmit={handleEdit} className="space-y-4">
                            {/* Basic Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Custom Fields Section - Solo lectura */}
                            {editData.customFields && editData.customFields.length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Custom Fields (Read Only)</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        {editData.customFields.map((field, index) => (
                                            <div key={index} className="text-sm">
                                                <span className="font-semibold text-gray-700">{field.fieldName}:</span>{' '}
                                                <span className="text-gray-600">{field.fieldValue}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                        To add more custom fields, use the "Add Custom Field" button in the provider card.
                                    </p>
                                </div>
                            )}

                            {/* Services Section - Solo lectura */}
                            {editData.services && editData.services.length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Assigned Services (Read Only)</h3>
                                    <div className="space-y-2">
                                        {editData.services.map((service, index) => (
                                            <div key={index} className="bg-green-50 p-3 rounded-lg">
                                                <p className="font-semibold text-green-800">{service.name}</p>
                                                {service.countries && service.countries.length > 0 && (
                                                    <p className="text-sm text-gray-600">
                                                        📍 {service.countries.map(c => c.name).join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                        To assign more services, use the "Assign Service" button in the provider card.
                                    </p>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setSelectedProvider(null); }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Field Modal */}
            {showCustomFieldModal && selectedProvider && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add Custom Field</h2>
                        <p className="text-gray-600 mb-6">For: {selectedProvider.name}</p>
                        <form onSubmit={handleAddCustomField} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                                <input
                                    type="text"
                                    value={customFieldData.fieldName}
                                    onChange={(e) => setCustomFieldData({...customFieldData, fieldName: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Field Value</label>
                                <input
                                    type="text"
                                    value={customFieldData.fieldValue}
                                    onChange={(e) => setCustomFieldData({...customFieldData, fieldValue: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+57 300 123 4567"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCustomFieldModal(false);
                                        setSelectedProvider(null);
                                        setCustomFieldData({ fieldName: '', fieldValue: '' });
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                                >
                                    Add Field
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Service Modal */}
            {showAssignServiceModal && selectedProvider && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Assign Service</h2>
                        <p className="text-gray-600 mb-6">For: {selectedProvider.name}</p>
                        <form onSubmit={handleAssignService} className="space-y-6">
                            {/* Select Service */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                                <select
                                    value={assignServiceData.serviceId}
                                    onChange={(e) => setAssignServiceData({...assignServiceData, serviceId: e.target.value})}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">-- Select a service --</option>
                                    {services.map(service => (
                                        <option key={service.id} value={service.id}>
                                            {service.name} (${service.hourlyRateUsd}/hr)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Countries */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Countries ({assignServiceData.countryCodes.length} selected)
                                </label>
                                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 grid grid-cols-2 gap-2">
                                    {countries.slice(0, 50).map((country) => (
                                        <label
                                            key={country.code || country.Code}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={assignServiceData.countryCodes.includes(country.code || country.Code)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    toggleCountry(country.code || country.Code);
                                                }}
                                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {country.name || country.Name || 'Unknown'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {countries.length === 0 && (
                                    <p className="text-gray-500 text-sm mt-2">Loading countries...</p>
                                )}
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAssignServiceModal(false);
                                        setSelectedProvider(null);
                                        setAssignServiceData({ serviceId: '', countryCodes: [] });
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition"
                                >
                                    Assign Service
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}