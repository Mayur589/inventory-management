import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:3001/api",
});

// items calls
export const getItems = () => api.get("/items");
export const createItems = (data) => api.post("/items", data);
export const updateItems = (id, data) => api.put(`/items/${id}`, data);
export const deleteItems = (id) => api.delete(`/items/${id}`);

// transactions calls
export const getTransactionsByDate = (date, session) => api.get(`/transactions/${date}/${session}`);
export const createTransactions = (data) => api.get(`/transactions`, data);
export const getTransactionsRange = (start, end) => api.get(`/transactions/range?start=${start}&end=${end}`);
export const deleteTransactions = (date, session) => api.delete(`/transactions/${date}/${session}`);

export default api;