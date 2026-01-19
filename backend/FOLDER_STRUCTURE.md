# NestJS Backend Folder Structure

## 📁 Complete Folder Tree

```
backend/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   ├── app.controller.ts                # Root controller
│   ├── app.service.ts                   # Root service
│   │
│   ├── config/
│   │   └── database.config.ts          # MySQL database configuration
│   │
│   ├── database/
│   │   └── database.service.ts         # Shared MySQL connection service (mysql2)
│   │
│   ├── auth/
│   │   ├── auth.module.ts              # Authentication module
│   │   ├── auth.controller.ts          # Auth endpoints (login, register)
│   │   ├── auth.service.ts             # Auth business logic
│   │   ├── dto/
│   │   │   ├── login.dto.ts            # Login request DTO
│   │   │   └── register.dto.ts         # Registration request DTO
│   │   └── strategies/
│   │       └── jwt.strategy.ts         # JWT authentication strategy
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts      # @Roles() decorator for route protection
│   │   ├── enums/
│   │   │   └── role.enum.ts            # Role enum (Admin, Vendor, Technician, User)
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts       # JWT authentication guard
│   │   │   └── roles.guard.ts          # Role-based access control guard
│   │   └── interfaces/
│   │       └── jwt-payload.interface.ts # JWT payload interface
│   │
│   └── modules/
│       ├── users/
│       │   ├── users.module.ts         # Users module
│       │   ├── users.controller.ts     # Users REST API endpoints
│       │   ├── users.service.ts        # Users business logic
│       │   ├── dto/
│       │   │   ├── create-user.dto.ts  # Create user DTO
│       │   │   └── update-user.dto.ts  # Update user DTO
│       │   └── addresses/
│       │       ├── user-addresses.module.ts
│       │       ├── user-addresses.controller.ts
│       │       ├── user-addresses.service.ts
│       │       └── dto/
│       │           ├── create-user-address.dto.ts
│       │           └── update-user-address.dto.ts
│       │
│       ├── admins/
│       │   ├── admins.module.ts
│       │   ├── admins.controller.ts
│       │   ├── admins.service.ts
│       │   ├── dto/
│       │   │   ├── create-admin.dto.ts
│       │   │   └── update-admin.dto.ts
│       │   └── addresses/
│       │       ├── admin-addresses.module.ts
│       │       ├── admin-addresses.controller.ts
│       │       ├── admin-addresses.service.ts
│       │       └── dto/
│       │           ├── create-admin-address.dto.ts
│       │           └── update-admin-address.dto.ts
│       │
│       ├── vendors/
│       │   ├── vendors.module.ts
│       │   ├── vendors.controller.ts
│       │   ├── vendors.service.ts
│       │   ├── dto/
│       │   │   ├── create-vendor.dto.ts
│       │   │   └── update-vendor.dto.ts
│       │   └── addresses/
│       │       ├── vendor-addresses.module.ts
│       │       ├── vendor-addresses.controller.ts
│       │       ├── vendor-addresses.service.ts
│       │       └── dto/
│       │           ├── create-vendor-address.dto.ts
│       │           └── update-vendor-address.dto.ts
│       │
│       ├── technicians/
│       │   ├── technicians.module.ts
│       │   ├── technicians.controller.ts
│       │   ├── technicians.service.ts
│       │   ├── dto/
│       │   │   ├── create-technician.dto.ts
│       │   │   └── update-technician.dto.ts
│       │   └── addresses/
│       │       ├── technician-addresses.module.ts
│       │       ├── technician-addresses.controller.ts
│       │       ├── technician-addresses.service.ts
│       │       └── dto/
│       │           ├── create-technician-address.dto.ts
│       │           └── update-technician-address.dto.ts
│       │
│       ├── services/
│       │   ├── services.module.ts
│       │   ├── services.controller.ts
│       │   ├── services.service.ts
│       │   └── dto/
│       │       ├── create-service.dto.ts
│       │       └── update-service.dto.ts
│       │
│       └── orders/
│           ├── orders.module.ts        # Orders module (maps to services_histories table)
│           ├── orders.controller.ts
│           ├── orders.service.ts
│           └── dto/
│               ├── create-order.dto.ts
│               └── update-order.dto.ts
│
├── test/                                # E2E tests (to be created)
└── .gitignore                           # Git ignore file
```

---

## 📋 Folder Explanations

### **Root Level (`src/`)**
- **`main.ts`**: Bootstrap file that creates the NestJS application and starts the server
- **`app.module.ts`**: Root module that imports all feature modules
- **`app.controller.ts`**: Root controller (optional, for health checks)
- **`app.service.ts`**: Root service (optional)

### **`config/`**
- **`database.config.ts`**: MySQL database configuration (host, port, user, password, database name) using environment variables

### **`database/`**
- **`database.service.ts`**: Shared MySQL connection service using `mysql2`. Provides connection pool/reusable connections for all modules. All modules will inject this service to execute queries.

### **`auth/`** - Authentication Module
- **`auth.module.ts`**: Configures JWT, passport strategies, and exports auth service
- **`auth.controller.ts`**: Handles `/auth/login`, `/auth/register` endpoints
- **`auth.service.ts`**: Business logic for login, registration, password hashing (bcrypt), JWT token generation
- **`dto/`**: Data Transfer Objects for request validation
  - `login.dto.ts`: Login request structure
  - `register.dto.ts`: Registration request structure
- **`strategies/`**: Passport strategies
  - `jwt.strategy.ts`: Validates JWT tokens in protected routes

### **`common/`** - Shared Utilities
- **`decorators/`**: Custom decorators
  - `roles.decorator.ts`: `@Roles('Admin', 'Vendor')` decorator for route protection
- **`enums/`**: TypeScript enums
  - `role.enum.ts`: Defines roles: `Admin`, `Vendor`, `Technician`, `User`
- **`guards/`**: Route guards
  - `jwt-auth.guard.ts`: Validates JWT token presence and validity
  - `roles.guard.ts`: Checks if user has required role for route access
- **`interfaces/`**: TypeScript interfaces
  - `jwt-payload.interface.ts`: Structure of data stored in JWT token

### **`modules/`** - Feature Modules

Each module follows the same pattern:
- **`.module.ts`**: Defines the module, imports dependencies, exports service
- **`.controller.ts`**: REST API endpoints (GET, POST, PUT, DELETE)
- **`.service.ts`**: Business logic, database queries using `database.service`
- **`dto/`**: Request/response validation classes

#### **`users/`** - Users Module
- Manages user CRUD operations
- **`addresses/`**: Sub-module for user addresses (users_addresses table)

#### **`admins/`** - Admins Module
- Manages admin CRUD operations
- **`addresses/`**: Sub-module for admin addresses (admins_addresses table)

#### **`vendors/`** - Vendors Module
- Manages vendor CRUD operations
- **`addresses/`**: Sub-module for vendor addresses (vendors_addresses table)

#### **`technicians/`** - Technicians Module
- Manages technician CRUD operations
- **`addresses/`**: Sub-module for technician addresses (technicians_addresses table)

#### **`services/`** - Services Module
- Manages service listings (IT services, laptops, etc.)
- Maps to `services` table

#### **`orders/`** - Orders Module
- Manages service orders/histories
- Maps to `services_histories` table
- Represents customer service requests

---

## 🔐 Authentication Flow

1. User registers/logs in → `auth.controller.ts`
2. `auth.service.ts` validates credentials, hashes password, generates JWT
3. JWT token returned to frontend
4. Frontend includes JWT in `Authorization: Bearer <token>` header
5. `jwt-auth.guard.ts` validates token
6. `roles.guard.ts` checks user role
7. Controller handler executes

---

## 📊 Database Access Pattern

- All modules use `database.service.ts` (injected via dependency injection)
- Service executes raw SQL queries using `mysql2`
- No ORM (TypeORM, Prisma) - pure SQL queries
- Connection pooling handled by `database.service`

---

## ✅ Next Steps

1. Install NestJS dependencies: `npm install @nestjs/common @nestjs/core @nestjs/platform-express`
2. Install MySQL driver: `npm install mysql2`
3. Install JWT packages: `npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs`
4. Install validation: `npm install class-validator class-transformer`
5. Create `.env` file for database credentials
6. Implement each module's controller, service, and DTOs
7. Set up route guards and decorators
8. Configure CORS for frontend communication

---

**Note**: This structure follows NestJS best practices with clear separation of concerns, making it perfect for a BCA final-year project! 🎓

