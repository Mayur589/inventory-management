import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Admin } from "../pages/Admin";
import { Navbar } from "../components/Navbar";
import { Inventory } from "../pages/Inventory";

function App() {
    return (
        <>
            <Router>
                <div className="max-h-screen">
                    <Navbar className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md z-50" />
                    <Routes>
                        <Route path="/admin" element={<Admin />} />
                    <Route path="/inventory" element={<Inventory />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
