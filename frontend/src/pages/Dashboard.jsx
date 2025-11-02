import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        toast.success('Logged out successfully!');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">T</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">Tekus Providers</span>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, <span className="font-semibold">{username}</span></span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Providers Card */}
                    <div
                        onClick={() => navigate('/providers')}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-6 border-l-4 border-blue-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Manage</p>
                                <h2 className="text-2xl font-bold text-gray-800 mt-1">Providers</h2>
                            </div>
                            <div className="bg-blue-100 p-4 rounded-full">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4">View and manage all providers</p>
                    </div>

                    {/* Services Card */}
                    <div
                        onClick={() => navigate('/services')}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer p-6 border-l-4 border-purple-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Manage</p>
                                <h2 className="text-2xl font-bold text-gray-800 mt-1">Services</h2>
                            </div>
                            <div className="bg-purple-100 p-4 rounded-full">
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4">View and manage all services</p>
                    </div>
                </div>
            </div>
        </div>
    );
}