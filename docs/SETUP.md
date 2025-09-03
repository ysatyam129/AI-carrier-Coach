# 🚀 AI Career Coach - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API Key

## Installation Steps

### 1. Clone and Setup

```bash
cd "Ai carrier"
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in server directory:
```env
MONGO_URI=mongodb://localhost:27017/ai-career-coach
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create `.env.local` file in client directory:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm run dev
```

### 4. Database Setup

The application will automatically connect to MongoDB. Make sure MongoDB is running on your system.

To seed sample quiz data:
```bash
cd server
node -e "require('./utils/seedQuiz')().then(() => process.exit())"
```

## 🌟 Features Available

✅ **Landing Page** - Beautiful homepage with features overview
✅ **Authentication** - Login/Register with JWT
✅ **Dashboard** - Interactive charts and progress tracking
✅ **Resume ATS Analyzer** - Upload and analyze resumes
✅ **Mock Interview Practice** - MCQ-based quizzes with timer
✅ **Cover Letter Generator** - AI-powered cover letter creation
✅ **Skill Demand Tracker** - Industry trends visualization

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Resume
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/history` - Get resume history

### Interview
- `GET /api/interview/quiz/:category` - Get quiz questions
- `POST /api/interview/quiz/submit` - Submit quiz answer
- `GET /api/interview/performance` - Get performance stats

### Skills
- `GET /api/skills/demand` - Get skill demand data
- `POST /api/skills/cover-letter` - Generate cover letter
- `GET /api/skills/career-tips` - Get career tips

### User
- `GET /api/user/dashboard` - Get dashboard data
- `PUT /api/user/profile` - Update user profile

## 🎯 Usage

1. **Register/Login** - Create account or sign in
2. **Dashboard** - View your progress and industry trends
3. **Upload Resume** - Get ATS score and improvement suggestions
4. **Practice Interviews** - Take quizzes in different categories
5. **Generate Cover Letters** - Create personalized cover letters
6. **Track Progress** - Monitor your career development

## 🔑 Environment Variables

### Server (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Client (.env.local)
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy server folder
3. Ensure MongoDB connection

### Frontend (Vercel/Netlify)
1. Set environment variables
2. Deploy client folder
3. Update API URL

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🎉**