# VendPro: Inventory & Vendor Payout Manager

**VendPro** is a specialized inventory management system designed for small vendors to track procurement from outside suppliers. It focuses on session-based logging (Morning/Afternoon) and automated payout calculations to ensure vendors know exactly how much they owe their suppliers at any given time.

## 🚀 Key Features

* **Session-Based Entry:** Log items bought in specific Morning or Afternoon slots to maintain high-resolution audit trails.
* **Master Catalog:** CRUD interface to manage products, default cost prices, and selling prices.
* **Financial Dashboard:** Real-time analytics using Recharts to visualize spending trends, total debt, and potential profit.
* **Voucher Generator:** Create and print professional receipts for individual sessions or consolidated date ranges.
* **Smart Upsert Logic:** Automatically merges or updates session data in the database based on date and time slot.
* **Dark Mode UI:** A high-contrast, professional "Fintech" aesthetic designed for visibility in various lighting conditions.

## 🛠️ Technical Stack

* **Frontend:** React.js, Tailwind CSS (Styling), Lucide-React (Icons), Recharts (Analytics).
* **State Management:** React Hooks (`useMemo`, `useEffect`).
* **Database:** PouchDB (NoSQL, local-first storage).
* **Backend:** Node.js / Express (API Layer).
* **Routing:** React Router v6.

---

## 📂 Project Structure

```text
frontend/
├── src/
│   ├── components/       # Reusable UI (Navbar, KPI Cards)
│   ├── pages/            # Dashboard, Inventory, Admin, Receipts
│   ├── services/         # API (Axios) configurations
│   └── App.jsx           # Main routing and Layout
backend/
├── config/               # PouchDB initializations
├── controllers/          # Transaction & Item logic
└── routes/               # API endpoints

```

---

## 🔧 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/vendpro.git
cd vendpro

```


2. **Install Dependencies:**
```bash
# For Frontend
cd frontend && npm install
# For Backend
cd backend && npm install

```


3. **Run the Project:**
```bash
# Start Backend (on port 3001)
cd backend && npm start
# Start Frontend
cd frontend && npm run dev

```



---

## 🧠 Business Logic: The "Session" Concept

Unlike standard inventory apps, VendPro treats time as a primary key.

* **Document ID Format:** `txn_${date}_${session}` (e.g., `txn_2026-01-11_morning`).
* **Payout Logic:** The system calculates debt based on the `cost_price` at the time of entry, protecting the record from future price changes in the Master Catalog.
* **Consolidation:** The "Receipts" page can aggregate multiple session documents into a single printable PDF report.

---

## 🛰️ Future Roadmap: Electron.js Integration

The long-term goal is to convert VendPro into a **Desktop Application** using Electron. This will allow:

* **Offline First:** Run without an internet connection using local PouchDB.
* **Hardware Access:** Direct printing to thermal receipt printers.
* **Auto-Launch:** App starts automatically when the vendor's PC turns on.
* **Native Notifications:** Low-stock or payout reminders.

### Proposed Electron Path:

1. Wrap the React build into an Electron `BrowserWindow`.
2. Move the Express API logic into the Electron `Main Process`.
3. Package the app using `electron-builder` for Windows (`.exe`) and macOS (`.dmg`).

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

**Built with ❤️ for Small Vendors.**
