# Job-Portal-Backend

## 🛠️ Tech Stack
Node.js – Runtime environment for server-side execution
Express.js – Lightweight web framework for building REST APIs
MongoDB – NoSQL database for storing users, jobs, and applications
Mongoose – ODM for MongoDB for schema modeling
JWT (JSON Web Tokens) – Secure token-based authentication
bcrypt.js – Password hashing
dotenv – Manage environment variables
Multer / Cloudinary (optional) – For uploading resumes or company logos

## User Roles
Job Seeker (User)
Employer (Company)
Admin

## ✅ Core Features & Services

### 🔐 Authentication & Authorization
Register/Login for Users, Companies, and Admins
JWT-based authentication for secure APIs
Role-based access control (user, company, admin)

### 👤 User Panel (Job Seekers)
Register/Login as job seeker
Update personal profile and resume
Search jobs with filters (location, keyword, company, etc.)
Apply for jobs
View applied jobs and their statuses

### 🏢 Company Panel (Employers)
Register/Login as company
Create, update, or delete job postings
View list of applicants per job
Manage company profile and logo

### 🛠 Admin Panel
Login as Admin
View and manage:
All users
All companies
All job postings
Application records
Block/Activate user or company accounts
Approve or verify new company registrations (optional)

### 💼 Job Services
CRUD operations for job listings (Create, Read, Update, Delete)
Filter by job title, type, experience, or location
Jobs pagination and sorting
📄 Job Application System
Apply to a job with resume
Prevent duplicate applications
View application history (for users and employers)
Application status tracking (optional: shortlisted/rejected/hired)

### 📁 File Upload (Optional)
Upload resumes or company logos via Multer or third-party service (e.g. Cloudinary)
