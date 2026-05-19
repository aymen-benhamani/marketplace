# 🛒 Marketplace Backend

API REST complète pour une application e-commerce multi-vendeurs, construite avec Node.js, Express et MongoDB.

## 🚀 Tech Stack

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MongoDB + Mongoose
- **Authentification** : JWT (JSON Web Tokens)
- **Upload fichiers** : Multer

---

## ⚙️ Installation

```bash
# Cloner le repo
git clone https://github.com/aymen-benhamani/marketplace.git
cd marketplace-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs
```

### Variables d'environnement (`.env`)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=votre_secret_jwt
PORT=5000
```

```bash
# Lancer en développement
npm run dev

# Lancer en production
npm start
```

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Inscription (name, email, password, role) |
| POST | `/api/auth/login` | Public | Connexion → retourne un token JWT |

### 📦 Products

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/products` | Public | Liste des produits (`?search=&category=`) |
| GET | `/api/products/:id` | Public | Détail d'un produit |
| GET | `/api/products/my` | Seller | Mes produits |
| POST | `/api/products` | Seller | Créer un produit (multipart/form-data) |
| PUT | `/api/products/:id` | Seller | Modifier un produit |
| DELETE | `/api/products/:id` | Seller | Supprimer un produit |

### 🧾 Orders

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/orders` | Client | Passer une commande |
| GET | `/api/orders/my` | Client | Historique de mes commandes |
| GET | `/api/orders/seller` | Seller | Commandes reçues |
| GET | `/api/orders/:id` | Client | Détail d'une commande |
| PATCH | `/api/orders/:id/status` | Seller | Mettre à jour le statut |

> Statuts disponibles : `pending` → `confirmed` → `shipped` → `delivered` / `cancelled`
>
> ⚠️ En cas d'annulation, le stock est automatiquement remis à jour.

### 👤 Users

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/users/profile` | Auth | Récupérer son profil |
| PUT | `/api/users/profile` | Auth | Modifier son profil |

### 🛡️ Admin

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/admin/users` | Admin | Liste de tous les utilisateurs |
| PATCH | `/api/admin/users/:id/status` | Admin | Approuver / rejeter un vendeur |

---

## 🔑 Authentification

Toutes les routes protégées nécessitent un header :

```
Authorization: Bearer <token>
```

---

## 👥 Rôles

| Rôle | Permissions |
|------|-------------|
| `client` | Parcourir les produits, passer des commandes, voir son historique |
| `seller` | Gérer ses produits, voir et traiter les commandes reçues |
| `admin` | Gérer les utilisateurs, approuver/rejeter les comptes vendeurs |

> Les comptes `seller` nécessitent une approbation admin avant de pouvoir publier des produits.

---

## 📁 Structure du projet

```
backend/
├── config/
│   └── db.js              # Connexion MongoDB
├── controllers/
│   ├── authController.js
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js  # protect, sellerOnly, adminOnly
├── models/
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── uploads/               # Images produits
├── .env.example
└── server.js
```

---

## 📄 Licence

MIT