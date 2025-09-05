import { useEffect, useState } from "react";
import {
    getItems,
    getTransactionsByDate,
    createItems,
    deleteItems,
    updateItems,
    deleteTransactions,
} from "../services/api";
import { Lock } from "lucide-react";

export const Admin = () => {
    const [isLoggedIn, setLogedIn] = useState(false);

    useEffect(() => {
        const savedLoggedIn = JSON.parse(
            localStorage.getItem("loggedIn") || "false",
        );
        setLogedIn(savedLoggedIn);
    }, []);

    useEffect(() => {
        localStorage.setItem("loggedIn", JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    return isLoggedIn ? (
        <AdminPage onLogOut={() => setLogedIn(false)} />
    ) : (
        <LogInPage onSuccess={() => setLogedIn(true)} />
    );
};

const LogInPage = ({ onSuccess }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === "admin123") {
            setError("");
            setPassword("");
            onSuccess();
        } else {
            setError("Invalid Password");
        }
    };

    return (
        <div className="admin-lock bg-[#F9FAFB] h-dvh flex">
            <div className="min-h-[400px] flex items-center justify-center px-4 w-full">
                <div className="bg-white rounded-xl shadow-sm border p-6 w-full max-w-md">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-red-600" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 text-center mb-15 mt-4">
                        Admin Access Required
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter admin password"
                                required
                            />
                            {error && (
                                <p className="text-red-600 text-sm mt-2">
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                            Login as Admin
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600">
                            <strong>Demo Password:</strong> admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminPage = ({ onLogOut }) => {
    return <h1>hello nothing here.</h1>;
};
