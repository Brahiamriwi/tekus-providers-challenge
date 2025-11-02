import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        toast.success('Logged out successfully!');
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => navigate('/dashboard')}
                        >
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">T</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">Tekus Providers</span>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden md:flex space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/providers')}
                                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                            >
                                Providers
                            </button>
                            <button
                                onClick={() => navigate('/services')}
                                className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                            >
                                Services
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">
              Welcome, <span className="font-semibold">{username}</span>
            </span>
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
    );
}