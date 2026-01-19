# .env File Content

## ⚠️ IMPORTANT: Create this file manually

The `.env` file is gitignored for security. Create it manually in the `backend/` directory.

## ✅ Required .env File Content

Create `backend/.env` with the following content:

```env
# Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:3000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=prathyu8281
DB_NAME=servicer

# JWT Configuration (will be used later)
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

## 🔍 Key Points

- **DB_PORT=3307** - XAMPP MySQL runs on port 3307 (not default 3306)
- **DB_PASSWORD=** - Empty string if no password is set (XAMPP default)
- **DB_NAME=serviceapp** - Make sure this database exists in phpMyAdmin

## ✅ Verification

After creating the `.env` file, start the backend and you should see:
```
🔌 MySQL Connection: host=localhost, port=3307, database=serviceapp, user=root
✅ MySQL connection pool created and tested successfully
```

