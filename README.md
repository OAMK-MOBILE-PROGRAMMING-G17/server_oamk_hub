# oamk_hub_server

## Authentication API

This API provides endpoints for user registration, login, and profile access.

### Endpoints

#### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  - `name` _(string)_: User's full name.
  - `email` _(string)_: User's email address.
  - `password` _(string)_: User's password (must be securely hashed).

---

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  - `email` _(string)_: User's registered email address.
  - `password` _(string)_: User's password.

---

#### Access Profile
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization` _(string)_: Bearer `<JWT_TOKEN>` (Required for authentication).

---

## Lost and Found Products API

### LostProducts Routes

#### 1. Create a Lost Product
- **URL**: `/lost-products`
- **Method**: `POST`
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body**:
  ```json
  {
    "title": "Lost Wallet",  // Title of the lost product
    "description": "Black leather wallet",  // Brief description
    "location": "Central Park",  // Last known location
    "image": "wallet.jpg",  // Image filename or URL
    "lost_time": "2025-04-01T10:00:00Z"  // ISO timestamp of when it was lost
  }
  ```

#### 2. Get All Lost Products
- **URL**: `/lost-products`
- **Method**: `GET`
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```

#### 3. Get a Lost Product by ID
- **URL**: `/lost-products/:id`
- **Method**: `GET`
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```

#### 4. Update a Lost Product
- **URL**: `/lost-products/:id`
- **Method**: `PUT`
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body**:
  ```json
  {
    "title": "Updated Lost Wallet",  // New title (if needed)
    "description": "Updated description"  // New description (if needed)
  }
  ```

#### 5. Delete a Lost Product
- **URL**: `/lost-products/:id`
- **Method**: `DELETE`
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```

---

### FoundProducts Routes

#### 1. Add a Comment for a Found Product
- **URL**: `/found-products`
- **Method**: `POST`
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Request Body**:
  ```json
  {
    "lostproducts_id": "1234567890abcdef",  // ID of the lost product being referenced
    "comments": "I found this wallet near the park bench."  // Description of where and how it was found
  }
  ```

#### 2. Get All Comments for a Lost Product
- **URL**: `/found-products/:lostProductId`
- **Method**: `GET`
- **Headers**:
  ```plaintext
  Authorization: Bearer <JWT_TOKEN>


  # Marketplace API Documentation

## 📦 Marketplace Routes

### ➕ Create a Marketplace Item

- **Endpoint:** `POST /marketplace`
- **Body:** `form-data` with the following fields:
  - `title` (string)
  - `description` (string)
  - `price` (number)
  - `end_date` (date)
  - `images` (multiple files)

---

### 📄 Get All Marketplace Items

- **Endpoint:** `GET /marketplace`

---

### 🔍 Get Marketplace Item by ID

- **Endpoint:** `GET /marketplace/:id`

---

### ✏️ Update Marketplace Item

- **Endpoint:** `PUT /marketplace/:id`

---

### ❌ Delete Marketplace Item

- **Endpoint:** `DELETE /marketplace/:id`

---

## 💬 Marketplace Chats Routes

### ➕ Create a Chat Message

- **Endpoint:** `POST /marketplace-chats`
- **Body:** JSON with the following fields:
  - `marketplace_id` (string)
  - `messages` (string or array of strings)

---

### 📄 Get Chat Messages by Marketplace ID

- **Endpoint:** `GET /marketplace-chats/:marketplaceId`

  
  ## 🛠️ API Specifications for Posts & Comments

> 🔐 All endpoints require JWT authentication via:
> `Authorization: Bearer <token>`

---

## 📌 Posts API

### 1. Create Post
- **Method:** `POST`
- **Endpoint:** `/posts`
- **Body:**
```json
{
  "content": "Your post content here"
}
```
- **Response:**
  - `201 Created`: Post created
  - `400 Bad Request`: Missing content
  - `500 Internal Server Error`

---

### 2. Get All Posts
- **Method:** `GET`
- **Endpoint:** `/posts`
- **Response:**
  - `200 OK`: List of posts
  - `500 Internal Server Error`

---

### 3. Get Post by ID
- **Method:** `GET`
- **Endpoint:** `/posts/:id`
- **Response:**
  - `200 OK`: Post data
  - `404 Not Found`: Post not found
  - `500 Internal Server Error`

---

### 4. Like/Unlike Post
- **Method:** `POST`
- **Endpoint:** `/posts/:id/like`
- **Response:**
  - `200 OK`: `{ message: "Post liked" }` or `{ message: "Like removed" }`
  - `404 Not Found`: Post not found
  - `500 Internal Server Error`

---

### 5. Dislike/Remove Dislike
- **Method:** `POST`
- **Endpoint:** `/posts/:id/dislike`
- **Response:**
  - `200 OK`: `{ message: "Post disliked" }` or `{ message: "Dislike removed" }`
  - `404 Not Found`: Post not found
  - `500 Internal Server Error`

---

### 6. Delete Post
- **Method:** `DELETE`
- **Endpoint:** `/posts/:id`
- **Response:**
  - `200 OK`: `{ message: "Post deleted successfully" }`
  - `404 Not Found`: Post not found
  - `500 Internal Server Error`

---

## 💬 Comments API

### 1. Add Comment to Post
- **Method:** `POST`
- **Endpoint:** `/comments/:postId`
- **Body:**
```json
{
  "content": "Your comment here"
}
```
- **Response:**
  - `201 Created`: Comment added
  - `400 Bad Request`: Missing content
  - `500 Internal Server Error`

---

### 2. Get Comments by Post ID
- **Method:** `GET`
- **Endpoint:** `/comments/:postId`
- **Response:**
  - `200 OK`: List of comments
  - `500 Internal Server Error`

