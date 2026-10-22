# 🎓 UBT Prep — Student Registration & Role Management System
> **Concise Database System** | SQLite 3 Backend + Interactive Web UI

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://sayancrash.github.io/sake/)
[![Database](https://img.shields.io/badge/Database-SQLite%203-blue?style=for-the-badge)](./database.db)
[![Backend](https://img.shields.io/badge/Backend-Python%20HTTP%20Server-yellow?style=for-the-badge)](./server.py)

---

## 🎯 Key Features

1. **Direct Student Sign-Up to Database (`database.db`)**:
   - Any student or user who registers via the **Sign Up** modal on the website has their details immediately inserted into the SQLite database.
   - Form fields: Full Name, Email, Password (hashed via SHA-256 with salt), and Position/Role.
   
2. **Live Role & Position Changer (Student / Teacher / Admin)**:
   - Click the **`👥 Users & Database`** button in the header bar.
   - A live table displays every registered user directly from `database.db`.
   - Each user has a position dropdown where you can change their role on the fly between:
     - 🎓 **Student**
     - 👨‍🏫 **Teacher (Instructor)**
     - 🛡️ **Administrator**
   - The updated role is saved instantly to `database.db` with an immediate confirmation toast.

3. **Quick User Creation & Deletion**:
   - Easily add test users or remove users directly from the management modal.

---

## 🚀 How to Run Locally

1. **Option 1 (One Click)**:
   Double-click **`start_server.bat`** on your computer.

2. **Option 2 (Terminal)**:
   ```bash
   python server.py
   ```
3. Open your browser at:
   👉 **`http://localhost:8000`**

---

## 📁 Clean & Concise Project Structure

```text
├── index.html          # Main platform UI with Sign Up and User Manager modal
├── css/
│   └── style.css       # Clean, modern stylesheet
├── js/
│   ├── app.js          # Registration, role changer, and API sync logic
│   └── icons.js        # SVG icons helper
├── server.py           # Lightweight Python backend with SQLite REST APIs
├── database.db         # SQLite 3 database storing registered users & roles
├── start_server.bat    # Quick 1-click server launcher
└── README.md           # Concise project documentation
```

---

## 📡 REST API Endpoints (`server.py`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Registers a new student or instructor into `database.db` |
| `POST` | `/api/auth/login` | Authenticates users against hashed passwords |
| `GET` | `/api/users` | Fetches all registered users from `database.db` |
| `POST` | `/api/users/update-role` | Updates a user's role/position in real time |
| `POST` | `/api/users/delete` | Deletes a user record from `database.db` |
| `GET` | `/api/courses` | Retrieves available UBT preparation courses |
