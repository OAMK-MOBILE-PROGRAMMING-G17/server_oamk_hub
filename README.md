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
  