# oamk_hub_server

# Authentication API

This API provides endpoints for user registration, login, and profile access.

## Endpoints

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  - `name`: User's name.
  - `email`: User's email address.
  - `password`: User's password.
  
- **Success Response**:
  - **Status**: `200 OK`
  - **Body**: User is successfully registered.

---

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  - `email`: User's email address.
  - `password`: User's password.
  
- **Success Response**:
  - **Status**: `200 OK`
  - **Body**: 
    - `token`: Authentication token (JWT).
    - `user`: The user's details (e.g., ID, name, email).

---

### Access Profile
- **URL**: `/auth/profile`
- **Method**: `GET`
- **Request Headers**:
  - `Authorization`: Bearer `<JWT_TOKEN>`
  
- **Success Response**:
  - **Status**: `200 OK`
  - **Body**: The authenticated user's profile information.
