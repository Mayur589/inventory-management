import { useEffect, useState } from "react";
import {
    getItems,
    getTransactionsByDate,
    createItems,
    deleteItems,
    updateItems,
    deleteTransactions,
} from "../services/api";
import { Lock, Plus, X, Save, LucideHeading4 } from "lucide-react";

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
    const [newItem, setNewItem] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [editItem, setEditItem] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatedItems, setUpdatedItems] = useState({});
    const [refresh, setRefresh] = useState(0);

    const handleSave = async (e) => {
        const newUpdatedItem = {
            ...editItem,
            ...updatedItems,
        };
        const id = newUpdatedItem._id;

        try {
            await updateItems(id, newUpdatedItem);
            console.log("Item is updated successfully");
            setUpdatedItems({});
            setEditItem("");
            setRefresh((prev) => prev + 1);
        } catch (err) {
            console.error("error in updating the data: ", err);
        }
    };

    const handleAddForm = async (e) => {
        e.preventDefault();
        try {
            await createItems(newItem);
            console.log("Item created successfully");
            setNewItem({});
            setShowAddForm(false);
            setRefresh((prev) => prev + 1);
        } catch (err) {
            console.error("error in posting the data: ", err);
        }
    };

    const handleEditItem = (item) => {
        setEditItem(item);
    };

    const cancelEdit = () => {
        setShowAddForm(false);
        setNewItem({});
    };

    const cancelEditItem = () => {
        setUpdatedItems({});
        setEditItem("");
    };

    const handleDeleteItem = async (id) => {
        try {
            await deleteItems(id);
            console.log("Item is deleted successfully");
            setItems((prevItems) =>
                prevItems.filter((item) => item._id !== id),
            );
        } catch (err) {
            console.error("error in deleting error: ", err);
        }
    };

    // getting already stored items from the backend
    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const res = await getItems();
                const itemData = res.data.data;
                setItems(itemData);
            } catch (err) {
                console.log("Failed to fetch the items: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchItemData();
    }, [refresh]);

    return (
        <div className="space-y-6 bg-[#101827] px-20 py-20">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Admin Panel
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage items, view transactions, and control inventory
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Item
                </button>
            </div>
            {showAddForm && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Add New Item
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={newItem.item_name || ""}
                            onChange={(e) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    item_name: e.target.value,
                                }))
                            }
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Selling price"
                            value={newItem.default_selling_price || ""}
                            onChange={(e) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    default_selling_price: e.target.value,
                                }))
                            }
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Cost Price"
                            value={newItem.default_cost_price || ""}
                            onChange={(e) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    default_cost_price: e.target.value,
                                }))
                            }
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Item Per Box"
                            value={newItem.items_per_box || ""}
                            onChange={(e) =>
                                setNewItem((prev) => ({
                                    ...prev,
                                    items_per_box: e.target.value,
                                }))
                            }
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            required
                        />
                        <div className="flex gap-1.5 justify-end col-span-4">
                            <button
                                onClick={cancelEdit}
                                className="flex items-center justify-center px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </button>
                            <button
                                onClick={handleAddForm}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {items && (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-4 lg:px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-white">
                            All Items ({items.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr>
                                    <th className="text-left py-2 lg:py-3 px-3 lg:px-6 font-medium text-slate-700 dark:text-slate-300 text-xs lg:text-sm">
                                        Item
                                    </th>
                                    <th className="text-center py-2 lg:py-3 px-3 lg:px-6 font-medium text-slate-700 dark:text-slate-300 text-xs lg:text-sm">
                                        Cost Price
                                    </th>
                                    <th className="text-center py-2 lg:py-3 px-3 lg:px-6 font-medium text-slate-700 dark:text-slate-300 text-xs lg:text-sm">
                                        Selling Price
                                    </th>
                                    <th className="text-center py-2 lg:py-3 px-3 lg:px-6 font-medium text-slate-700 dark:text-slate-300 text-xs lg:text-sm">
                                        Item Per Box
                                    </th>
                                    <th className="text-center py-2 lg:py-3 px-3 lg:px-6 font-medium text-slate-700 dark:text-slate-300 text-xs lg:text-sm">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {items && items.length > 0 ? (
                                    items.map((item) => (
                                        <tr
                                            key={item.item_name}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            {editItem._id === item._id ? (
                                                <>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-left">
                                                        <input
                                                            type="text"
                                                            name="item_name"
                                                            value={
                                                                updatedItems.item_name ??
                                                                item.item_name ??
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                setUpdatedItems(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        item_name:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                );
                                                            }}
                                                            className="w-full rounded-md border p-2"
                                                        />
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-center">
                                                        <input
                                                            type="number"
                                                            name="default_cost_price"
                                                            value={
                                                                updatedItems.default_cost_price ??
                                                                item.default_cost_price ??
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                setUpdatedItems(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        default_cost_price:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                );
                                                            }}
                                                            className="w-full rounded-md border p-2 text-center"
                                                        />
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-center">
                                                        <input
                                                            type="number"
                                                            name="default_selling_price"
                                                            value={
                                                                updatedItems.default_selling_price ??
                                                                item.default_selling_price ??
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                setUpdatedItems(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        default_selling_price:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                );
                                                            }}
                                                            className="w-full rounded-md border p-2 text-center"
                                                        />
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-left">
                                                        <input
                                                            type="number"
                                                            name="items_per_box"
                                                            value={
                                                                updatedItems.items_per_box ??
                                                                item.items_per_box ??
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                setUpdatedItems(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        items_per_box:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                );
                                                            }}
                                                            className="w-full rounded-md border p-2 text-center"
                                                        />
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm mx-0">
                                                        <div className="btn flex place-content-center gap-1.5">
                                                            <div
                                                                className="bg-green-600 w-20 h-8 place-content-center rounded-xl text-center hover:cursor-pointer hover:bg-green-700 text-slate-900 dark:text-slate-200"
                                                                onClick={() =>
                                                                    handleSave()
                                                                }
                                                            >
                                                                Save
                                                            </div>
                                                            <div
                                                                className="bg-red-600 w-20 h-8 place-content-center rounded-xl text-center hover:cursor-pointer hover:bg-red-700 text-slate-900 dark:text-slate-200"
                                                                onClick={() =>
                                                                    cancelEditItem()
                                                                }
                                                            >
                                                                Cancel
                                                            </div>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-left">
                                                        {item.item_name}
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-center">
                                                        {
                                                            item.default_cost_price
                                                        }
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-center">
                                                        {
                                                            item.default_selling_price
                                                        }
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 text-center">
                                                        {item.items_per_box}
                                                    </td>
                                                    <td className="px-3 lg:px-6 py-4 text-sm text-slate-900 dark:text-slate-200 mx-0">
                                                        <div className="btn flex place-content-center gap-1.5">
                                                            <div
                                                                className="bg-blue-600 w-20 h-8 place-content-center rounded-xl text-center hover:cursor-pointer hover:bg-blue-700"
                                                                onClick={() =>
                                                                    handleEditItem(
                                                                        item,
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </div>
                                                            <div
                                                                className="bg-red-600 w-20 h-8 place-content-center rounded-xl text-center hover:cursor-pointer        hover:bg-red-700"
                                                                onClick={() =>
                                                                    handleDeleteItem(
                                                                        item._id,
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </div>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        <tr>
                                            <td colSpan="5" className="py-12">
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                                                        <Plus className="h-6 w-6 text-gray-400"></Plus>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                                        No items available
                                                    </p>
                                                    <p className="text-gray-400 text-xs mt-1">
                                                        Start by adding your
                                                        first item
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
