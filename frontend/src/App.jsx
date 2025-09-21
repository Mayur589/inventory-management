import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Admin } from "../pages/Admin";
import { Inventory } from "../pages/Inventory";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md z-50" />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
