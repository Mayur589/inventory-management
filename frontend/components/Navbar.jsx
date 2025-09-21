import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const navItem = [
    { name: "Dashboard", path: "/" },
    { name: "Inventory", path: "/inventory" },
    { name: "Recipts", path: "/recipts" },
    { name: "Admin", path: "/admin" },
  ];
  return (
    // <nav className="bg-[#224193] sticky top-0 text-white px-6 py-4 flex items-center justify-between shadow-md z-50">
    //   {/* Left: Logo */}
    //   <div className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
    //     Inventory Pro
    //   </div>

    //   {/* Center/Right: Nav Links */}
    //   <div className="hidden md:flex space-x-8">
    //     {navItem.map((item) => (
    //       <Link key={item.name} to={item.path} className="relative group">
    //         <span className="transition-colors duration-200 group-hover:text-[#6f9bd1]">
    //           {item.name}
    //         </span>
    //         {/* underline effect */}
    //         <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#df3c5f] transition-all group-hover:w-full"></span>
    //       </Link>
    //     ))}
    //   </div>

    //   {/* Mobile Menu Button */}
    //   <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition">
    //     <Menu size={28} />
    //   </button>
    // </nav>
    
    <nav className="bg-gray-900 sticky top-0 text-white px-6 py-4 flex items-center justify-between shadow-md z-50">
      {/* Left: Logo */}
      <div className="text-2xl font-bold text-blue-500">
        Inventory Pro
      </div>
    
      {/* Center/Right: Nav Links */}
      <div className="hidden md:flex space-x-8">
        {navItem.map((item) => (
          <Link key={item.name} to={item.path} className="relative group text-gray-200 hover:text-white transition-colors">
            {item.name}
            {/* subtle underline effect */}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
          </Link>
        ))}
      </div>
    
      {/* Mobile Menu Button */}
      <button className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition">
        <Menu size={28} />
      </button>
    </nav>

  );
};
