import { Admin } from "../pages/Admin.jsx";
import { Menu } from "lucide-react";

export const Navbar = () => {
    return (
        <nav className="bg-[#224193] sticky top-0 text-white px-6 py-4 flex items-center justify-between shadow-md z-50">
            {/* Left: Logo */}
            <div className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Inventory Pro
            </div>

            {/* Center/Right: Nav Links */}
            <div className="hidden md:flex space-x-8">
                {["Dashboard", "Inventory", "Receipts", "Admin"].map((item) => (
                    <a key={item} href="#" className="relative group">
                        <span className="transition-colors duration-200 group-hover:text-[#6f9bd1]">
                            {item}
                        </span>
                        {/* underline effect */}
                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#df3c5f] transition-all group-hover:w-full"></span>
                    </a>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition">
                <Menu size={28} />
            </button>
        </nav>
    );
};
