# 📝 Notes App - Backend

This repository contains the backend of the **Notes App**, a full-featured note-taking application with **JWT-based authentication, personal vaults, categories, and CRUD operations**. The backend is built using **Node.js, Express.js, MongoDB, and Mongoose**, providing a secure and scalable API for frontend consumption.

---

## 🔧 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing  
- **Environment Management:** dotenv  
- **Version Control:** Git & GitHub  

---

## 🚀 Features

### 🔐 Authentication
- User Registration (Create account) ✅  
- User Login ✅  
- Logout (optional but recommended) ✅  
- JWT-based authentication ✅  
- Password hashing with bcrypt ✅  
- Refresh token system (optional for advanced flow)  

### 🗂 Notes Categories
- Categories with CRUD operations:  
  - Daily Journal ✅  
  - Thought of the Day ✅  
  - Memories ✅  
  - General ✅  
  - Trash ✅  
  - Personal ✅  

### 👤 User Management
- Create User ✅  
- Delete User → Cascade delete all user notes ✅  

### 📅 Thought of the Day
- Users can add **one unique thought per day** ✅  

### 📦 General Features & Enhancements
- Search by title or content  
- Sort/Filter by:
  - Date  
  - Category  
  - Pinned/Favorite  
- Pagination for large note lists  
- Soft Delete:
  - Notes move to Trash first  
  - Option to restore or permanently delete  

### 🔒 Personal Notes (Private Vault)
- Separate section for private notes ✅  
- Accessible **only with secondary password**  
- Secondary password stored securely (hashed)  
- Lock personal section after 3–5 incorrect attempts  
- Optional features:
  - Email notification/activity log on failed attempts  
  - Session expiry after inactivity  
  - "Remember for X minutes" option  

---

## 🧾 Data Models

### Note Schema
```json
{
  "title": "string",
  "content": "string",
  "category": "enum: dailyJournal | thought | memory | general | personal",
  "createdAt": "Date",
  "updatedAt": "Date",
  "tags": ["string"],
  "isPinned": "Boolean",
  "isArchived": "Boolean",
  "isTrashed": "Boolean"
}
