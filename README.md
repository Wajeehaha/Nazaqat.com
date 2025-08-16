# 🛍 Nazakat Nail Store

Welcome to *Nazakat Nail Store*, a specialized e-commerce platform for nail products. This project focuses exclusively on nail products with 4 categories organized in 2 premium collections, providing a seamless shopping experience with a modern UI and robust backend.

---

## 📖 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Backend Models](#backend-models)
- [Contributing](#contributing)
- [Contact](#contact)

---

## ✨ Features

- *Nail Product Management*: Browse nail products across 4 categories (Gel Nails, Acrylic Nails, Nail Art, Nail Care)
- *Collection System*: Products organized in 2 premium collections (Collection 1 & Collection 2)
- *Category Browsing*: Dedicated pages for each nail category
- *Cart Functionality*: Add, update, and remove nail products from the cart
- *Responsive Design*: Optimized for mobile, tablet, and desktop devices
- *User Authentication*: Secure login and registration system
- *Stock Validation*: Ensures product stock is maintained during cart updates
- *Search Functionality*: Search for specific nail products
- *Order Management*: Complete order processing with email confirmations

---

## 🛠 Technologies Used

### Frontend
- *React* with *TypeScript*
- *Vite* for fast builds
- *Tailwind CSS* for styling
- *shadcn-ui* for reusable components
- *Axios* for API requests

### Backend
- *Node.js* with *Express.js*
- *MongoDB* for database
- *Mongoose* for schema modeling
- *JWT* for authentication (future implementation)

---

## 📂 Project Structure

<pre><code>📦 project-root ├── 📁 backend │ ├── 📁 middleware │ ├── 📁 models │ ├── 📁 node_modules │ ├── 📁 routes │ ├── 📁 uploads │ ├── 📁 utils │ ├── 📄 .env │ ├── 📄 .gitignore │ ├── 📄 db.js │ ├── 📄 package-lock.json │ ├── 📄 package.json │ └── 📄 server.js │ ├── 📁 frontend │ ├── 📁 node_modules │ ├── 📁 public │ ├── 📁 src │ ├── 📄 .gitignore │ ├── 📄 bun.lockb │ ├── 📄 components.json │ ├── 📄 eslint.config.js │ ├── 📄 index.html │ ├── 📄 package-lock.json │ ├── 📄 package.json │ ├── 📄 postcss.config.js │ ├── 📄 README.md │ ├── 📄 tailwind.config.ts │ ├── 📄 tsconfig.app.json │ ├── 📄 tsconfig.json │ ├── 📄 tsconfig.node.json │ ├── 📄 vite.config.ts │ ├── 📄 package-lock.json │ ├── 📄 package.json │ └── 📄 README.md </code></pre>
---

## 🖥 Setup Instructions

### Prerequisites
- *Node.js* and *npm* installed on your machine.
- *MongoDB* running locally or on a cloud service.

### Steps to Run Locally

1. Clone the repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>

2. cd Web_Project

3. `cd frontend && npm install`
   `cd ../backend && npm install`
4. In .env
    `MONGO_URI=<YOUR_MONGO_DB_CONNECTION_STING>`
    `PORT=3000`
5. `cd backend`
   `npm start`
6. `cd ../frontend`
   `npm run dev`
7. `http://localhost:5173`
