# 🧩 Dynamic Data Table Manager

A responsive and interactive **data table manager** built with **Next.js**, **TypeScript**, **Redux Toolkit**, and **Material UI (MUI)**.  
This project enables you to create, edit, sort, search, and manage data dynamically — including CSV import/export and a built-in light/dark mode.

---

## 🚀 Features

- **Add / Edit / Delete Rows**
- **Dynamic Column Management** — add or toggle visibility
- **Global Search** across all fields
- **Sortable Columns** (ASC/DESC)
- **Pagination** (5–50 rows per page)
- **CSV Import / Export**
- **Persistent State** via Redux Persist
- **Theme Toggle** — light and dark modes
- **Responsive UI** optimized for all screen sizes



## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| State Management | Redux Toolkit + Redux Persist |
| UI Library | Material UI (MUI v5+) |
| CSV Handling | PapaParse + FileSaver.js |
| Forms | React Hook Form |
| Styling | MUI System (sx prop + custom theme) |

---

## 📂 Folder Structure

src/
├── app/
│ ├── layout.tsx # Root layout (Theme + Redux Provider)
│ └── page.tsx # Main page (renders TableManager)
│
├── components/
│ ├── TableManager.tsx # Main table logic + UI
│ ├── ManageColumnsDialog.tsx # Add / hide columns modal
│ └── SnackbarAlert.tsx # Reusable alert/snackbar component
│
├── store/
│ ├── index.ts # Redux store setup
│ └── slices/
│ └── tableSlice.ts # Table reducer + actions
│
├── theme/
│ └── themeProvider.tsx # MUI Theme + Dark Mode toggle
│
└── utils/
└── csvUtils.ts # CSV Import/Export helper
└── csvUtils.ts # CSV Import/Export helper


---



## ⚙️ Getting Started

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/dynamic-data-table.git
cd dynamic-data-table

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Run the Development Server

npm run dev
App will be running on http://localhost:3000

### 🧭 Usage

Action	Description
➕ Add Row	Opens a dialog to add a new record
🧱 Manage Columns	Add, show, or hide columns dynamically
🔍 Search	Filter rows instantly across all fields
↕️ Sort	Click on column headers to sort
📤 Export CSV	Export current data as .csv
📥 Import CSV	Upload .csv to add new data (auto-detects new columns)
🌗 Theme Toggle	Switch between light & dark mode
🧾 Example CSV Format
Name,Email,Age,Role
John Doe,john@example.com,28,Developer
Jane Smith,jane@example.com,32,Designer

🧱 Future Enhancements

Inline cell editing

Column reordering via drag-and-drop

Role-based user access

Excel (.xlsx) import/export

Cloud database integration

### 🧑‍💻 Author

Mohammed Taher
Frontend Developer | Passionate about clean UI, TypeScript, and React.

### 📫 Connect:
GitHub: https://github.com/Taher9845
LinkedIn: https://www.linkedin.com/in/mohammedtaher87/

### 🪪 License

This project is licensed under the MIT License.
Feel free to use and modify for personal or educational purposes.

⭐ Star this repository if you found it helpful!
