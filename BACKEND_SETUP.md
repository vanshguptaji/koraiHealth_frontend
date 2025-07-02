# Instructions for Backend CORS Configuration

## Update your backend app.js CORS configuration:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174', 
        'http://localhost:3000',
        process.env.FRONTEND_URL || 'http://localhost:5174'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}))
```

## Update your .env file in backend:

```
CORS_ORIGIN=http://localhost:5174
FRONTEND_URL=http://localhost:5174
PORT=8001
```

Note: The frontend may run on port 5173 or 5174 depending on availability. Make sure both ports are included in CORS origins.

## Make sure your backend is running on:
http://localhost:8001

## Frontend will try to connect to:
http://localhost:8001/api/v1

## Lab Report Upload Endpoints:
- POST /api/v1/lab-reports/upload (file upload with multipart/form-data)
- GET /api/v1/lab-reports (get user's uploaded reports)
- GET /api/v1/lab-reports/health/dashboard (get health dashboard data)
- GET /api/v1/lab-reports/health/trends (get health trends with query params)
- DELETE /api/v1/lab-reports/:reportId (delete a report)

## Test the connection:
1. Start your backend server on port 8001
2. Test registration: POST http://localhost:8001/api/v1/users/register
3. Test login: POST http://localhost:8001/api/v1/users/login
