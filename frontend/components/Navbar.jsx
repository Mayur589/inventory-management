import { Menu, X, LayoutDashboard, Package, Receipt, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Hook to check the current route

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Inventory", path: "/inventory", icon: <Package size={18} /> },
    { name: "Receipts", path: "/recipts", icon: <Receipt size={18} /> },
    { name: "Admin", path: "/admin", icon: <ShieldCheck size={18} /> },
  ];

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-gray-800 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <Package className="text-white w-5 h-5" />
          </div>
          <div className="text-xl font-black tracking-tighter text-white">
            VEND<span className="text-blue-500">PRO</span>
          </div>
        </Link>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0b0f1a] border-b border-gray-800 p-4 space-y-2 md:hidden animate-in slide-in-from-top duration-200">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
