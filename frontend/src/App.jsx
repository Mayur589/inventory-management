import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { Navbar } from ".././components/NavBar"; // Adjusted path
import { Admin } from ".././pages/Admin";
import { Inventory } from ".././pages/Inventory";
import { Receipts } from ".././pages/Recipts";
import {Dashboard} from ".././pages/Dashboard"
import "./App.css";

function App() {
  return (
    <Router>
      {/* The outer div ensures the dark background (#0b0f1a)
        always covers 100% of the screen height
      */}
      <div className="flex flex-col min-h-screen bg-[#0b0f1a]">

        {/* Navbar is outside Routes so it stays visible on every page */}
        <Navbar />

        {/* Main Content Area:
          flex-1 makes this div take up all remaining vertical space
        */}
        <main className="flex-1">
          <Routes>
            {/* Default Route: Redirects from "/" to "/inventory" */}
            <Route path="/" element={<Dashboard />} />

            <Route path="/inventory" element={<Inventory />} />
            <Route path="/admin" element={<Admin />} />

            {/* Optional: Add a Receipts page placeholder later */}
            <Route path="/recipts" element={<Receipts />} />

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/inventory" replace />} />
          </Routes>
        </main>

        {/* You could add a small Footer here for vendor support/contact */}
      </div>
    </Router>
  );
}

export default App;
