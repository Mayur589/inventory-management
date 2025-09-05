import { href, Link, useLocation, useNavigate } from "react-router-dom";
import {
    Home,
    Package,
    Receipt,
    Settings,
    LogOut,
    User,
    Sun,
    Moon,
    Menu,
    X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

export const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, logoutAdmin] = useState(false);

    const navigation = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Inventory", href: "/inventory", icon: Package },
        { name: "Recipts", href: "/recipts", icon: Receipt },
        { name: "Admin", href: "/admin", icon: Settings },
    ];

    // const handleLogout = () => {
    //      logoutAdmin();
    //      navigate("/");
    // };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <Package className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                                InventoryPro
                            </h1>
                            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                                Management System
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="mt-4 lg:mt-6">
                    <div className="px-2 lg:px-3">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                                >
                                    <Icon
                                        className={`mr-3 h-5 w-5 ${
                                            isActive
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* User section */}
                {state.isAdmin && (
                    <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Admin
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Logged in
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile header */}
                <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <Package className="w-6 h-6 text-blue-600" />
                            <span className="font-bold text-gray-900 dark:text-white">
                                InventoryPro
                            </span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Desktop theme toggle */}
                <div className="hidden lg:flex justify-end p-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                <main className="flex-1 p-4 lg:p-6 lg:pt-0">{children}</main>
            </div>
        </div>
    );
};
