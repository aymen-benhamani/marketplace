# 🛒 Marketplace Frontend

Modern e-commerce frontend built with React, Vite and Tailwind CSS. Supports three roles: client, seller, and admin.

---

## 🚀 Tech Stack

- **Framework** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router DOM
- **HTTP** : Fetch API with JWT auth header
- **State** : React Context API

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/aymen-benhamani/marketplace.git
cd marketplace

# Install dependencies
npm install

# Configure API URL
# Edit src/config.js
export const API_BASE = "http://localhost:5000/api";

# Start dev server
npm run dev
```

---

## 📁 Project Structure

```
src/
├── assets/                  # Images and static files
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Select.jsx
│   │   ├── Spinner.jsx
│   │   └── StatusBadge.jsx
│   ├── CartDrawer.jsx       # Slide-in cart panel
│   ├── Navbar.jsx           # Sticky navbar with role-based links
│   ├── ProductCard.jsx      # Product display card
│   └── ProtectedRoute.jsx   # Route guard by role
├── context/
│   ├── AuthContext.jsx      # Auth state + authFetch helper
│   ├── CartContext.jsx      # Cart state management
│   ├── NotifContext.jsx     # Notification badges
│   └── ToastContext.jsx     # Toast notifications
├── pages/
│   ├── AdminPage.jsx        # User management (admin only)
│   ├── CheckoutPage.jsx     # Multi-step checkout with card/PayPal/COD
│   ├── HomePage.jsx         # Product listing with search & filters
│   ├── LoginPage.jsx
│   ├── MyOrdersPage.jsx     # Client order history
│   ├── MyProductsPage.jsx   # Seller product management
│   ├── ProductDetailPage.jsx
│   ├── ProfilePage.jsx      # Edit name, email, password
│   ├── RegisterPage.jsx
│   └── SellerOrdersPage.jsx # Seller order management
├── utils/
├── App.jsx                  # Routes definition
├── config.js                # API base URL
└── main.jsx
```

---

## 🔐 Roles & Features

### 👤 Client
- Browse and search products by category
- Add to cart, adjust quantities
- Multi-step checkout (shipping + payment)
- Track order status
- Notification badge on new order updates

### 🏪 Seller
- Create, edit, delete products (with image upload)
- View and manage received orders
- Update order status: `pending` → `confirmed` → `shipped` → `delivered`
- Cancel orders (stock auto-restored)
- Notification badge on new orders

### 🛡️ Admin
- View all users
- Approve or reject seller accounts

---

## 🗺️ Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home — product listing |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/product/:id` | Public | Product detail |
| `/checkout` | Client | Checkout |
| `/my-orders` | Client | Order history |
| `/my-products` | Seller | Product management |
| `/seller-orders` | Seller | Received orders |
| `/profile` | All | Edit profile |
| `/admin` | Admin | User management |

---

## 🔗 Related

- **Backend repo** : [marketplace-backend](https://github.com/tonpseudo/marketplace-backend)


---

## 📄 License

MIT