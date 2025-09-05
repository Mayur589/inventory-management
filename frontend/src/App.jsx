import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Admin } from "../pages/Admin";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
