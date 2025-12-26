# Task Manager - Project Documentation

## Overview
A full-stack task management application built with React (frontend) and Node.js/Express (backend). The application uses JWT-based authentication with httpOnly cookies and MongoDB for data persistence.

**Repositories:**
- Frontend: https://github.com/21PM/Task-Manager
- Backend: https://github.com/21PM/Task-Manger-Backend

---

## 1. Project Structure

### Frontend
- **Framework:** React with Vite
- **State Management:** React Context + TanStack Query (React Query v5)
- **Styling:** [Tailwind/CSS/etc.]

### Backend
- **Framework:** Node.js + Express
- **Database:** MongoDB
- **Authentication:** JWT (Access & Refresh tokens in httpOnly cookies)

**Note:** `node_modules` is git-ignored in both repositories.

---

## 2. Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)
- Git

---

## 3. Backend Setup

### Installation
```bash
# Clone the repository
git clone https://github.com/21PM/Task-Manger-Backend.git
cd Task-Manger-Backend

# Install dependencies
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
```

### Running the Backend
```bash
# Development mode with auto-reload
node --watch src/server.js

```

The server will start on `http://localhost:5000` (or your specified PORT).

---

## 4. Frontend Setup

### Installation
```bash
# Clone the repository
git clone https://github.com/21PM/Task-Manager.git
cd Task-Manager

# Install dependencies
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Running the Frontend
```bash
npm run dev
```

The application will start on `http://localhost:5173`.

---

## 5. API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### **Sign up**
```
POST /auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
   "name":john
}

```

**Response:**
```json
{
    "message": "Signup successful",
    "userId": "694e33deee9c1f095704e8af",
    "name": "jp",
    "email": "jp@gmail.com"
}

```

---

#### **Login**
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "userDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "id": "694ceb6e7bea1e4e6a0c7ff1",
    "role": "ADMIN"
  }
}
```

**Note:** Access token and refresh token are sent as httpOnly cookies.

---

#### **Logout**
```
POST /auth/logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

#### **Get Current User**
```
GET /auth/me
```

**Headers:** Requires authentication cookie

**Response:**
```json
{
  "success": true,
  "userDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "id": "694ceb6e7bea1e4e6a0c7ff1",
    "role": "ADMIN"
  }
}
```

---

### Task Endpoints

#### **Get All Tasks**
```
GET /tasks
```

#### **Get Single Task**
```
GET /tasks/:id
```

#### **Create Task**
```
POST /tasks
```

#### **Update Task**
```
PUT /tasks/:id
```

#### **Delete Task**
```
DELETE /tasks/:id
```

---

## 6. Authentication Strategy

### Token Management
- **Access Token:** Short-lived (15 minutes), stored in httpOnly cookie
- **Refresh Token:** Long-lived (7 days), stored in httpOnly cookie
- **Storage:** Cookies are httpOnly, secure, and SameSite protected

### Frontend Authentication Flow
1. User logs in → Backend sets httpOnly cookies
2. Frontend stores auth state in React Context
3. On page refresh → Call `/auth/me` to restore auth state
4. Expired access token → Auto-refresh using refresh token
5. Frontend never accesses tokens directly

### Benefits
- **Security:** Prevents XSS attacks
- **Convenience:** Automatic token handling
- **Reliability:** Session persists across page refreshes

---

## 7. State Management

### Frontend Architecture
- **Authentication State:** React Context API
- **Server State:** TanStack Query (React Query v5)
  - API calls
  - Caching
  - Auto-refetching
  - Loading/error states

### Example Usage
```javascript
// Using React Query for tasks
const { data: tasks, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks
});
```

---

## 8. Features

- ✅ User authentication (register, login, logout)
- ✅ Protected routes
- ✅ Task CRUD operations
- ✅ Token refresh mechanism
- ✅ Responsive design
- ✅ Role-based access control

---

## 9. Development Notes

### Assumptions
- Users must log in after registration (no auto-login)
- Email verification is not implemented
- Tokens are managed exclusively by the backend

### Trade-offs
- **Security vs Convenience:** httpOnly cookies require backend calls to verify auth status but significantly improve security
- **Session Management:** Using cookies instead of localStorage prevents XSS but requires CORS configuration



## 12. Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure backend CORS is configured with `credentials: true`
- Frontend must send requests with `credentials: 'include'`

**Authentication not persisting:**
- Check cookie settings (httpOnly, secure, sameSite)
- Verify `/auth/me` is being called on app initialization

**MongoDB Connection Issues:**
- Verify `MONGO_URI` is correct
- Check network access in MongoDB Atlas

---

