# MyIQ Quiz Application

A full-stack quiz management system built with Next.js, React, TypeScript, and MySQL. Features user authentication, quiz creation, and real-time quiz taking with score tracking.

## 🚀 Features

### 🔐 Authentication System

- **User Registration** with validation
- **Secure Login** with JWT tokens
- **Password Hashing** using bcrypt
- **Auto-login** with token persistence
- **Protected Routes** throughout the app

### 📚 Quiz Management

- **Create Questions** with multiple categories
- **Take Quizzes** with real-time progress tracking
- **Score Calculation** and history storage
- **10 Pre-defined Categories** (General Knowledge, Math, Science, etc.)
- **Difficulty Levels** (Easy, Medium, Hard)

### 💾 Database Integration

- **MySQL Database** with full schema
- **User Management** with secure authentication
- **Quiz Sessions** tracking and analytics
- **Answer History** for detailed progress tracking

### 🎨 Modern UI/UX

- **Responsive Design** with Tailwind CSS
- **Dark/Light Theme** support
- **Loading States** and error handling
- **Real-time Feedback** during quizzes
- **Progress Indicators** and animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes
- **Database**: MySQL with mysql2
- **Authentication**: JWT, bcrypt
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL Server** running on localhost
- **Git** (for cloning/contributing)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/myiq-quiz-app.git
cd myiq-quiz-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Auto-setup (Recommended)

```bash
# Update MySQL credentials in lib/database.ts first
node scripts/init-db.js
```

#### Option B: Manual Setup

1. Create a MySQL database named `myiq_db`
2. The application will auto-create tables on first API call

### 4. Configure Database

Update the database credentials in `lib/database.ts`:

```typescript
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "YOUR_MYSQL_PASSWORD", // Update this
  database: "myiq_db",
  port: 3306,
};
```

### 5. Start Development Server

```bash
npm run dev
```

### 6. Open Application

Visit [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

## 📖 Usage Guide

### Getting Started

1. **Register** a new account or **Login** with existing credentials
2. **Add Questions** using the admin panel to populate the quiz database
3. **Take Quizzes** by selecting a category and answering 10 questions
4. **View Results** and track your progress over time

### Admin Features

- **Dashboard**: Overview of system statistics
- **Add Questions**: Create new quiz questions with categories
- **Take Quiz**: Test yourself with available questions
- **User Management**: View user accounts and activity

## 🗄️ Database Schema

```sql
-- Users table
users (
  id INT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP
)

-- Categories table
categories (
  id INT PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  description TEXT
)

-- Questions table
questions (
  id INT PRIMARY KEY,
  question_text TEXT,
  option_a VARCHAR(255),
  option_b VARCHAR(255),
  option_c VARCHAR(255),
  option_d VARCHAR(255),
  correct_answer ENUM('A','B','C','D'),
  category_id INT,
  difficulty ENUM('easy','medium','hard')
)

-- Quiz sessions and user answers tables for tracking
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Quiz Management

- `GET /api/quiz/categories` - Get all categories
- `GET /api/quiz/questions` - Get questions (with filters)
- `POST /api/quiz/questions` - Create new question
- `POST /api/quiz/session` - Start quiz session
- `POST /api/quiz/answer` - Submit answer
- `POST /api/quiz/complete` - Complete quiz and calculate score

## 🎯 Available Categories

1. **General Knowledge** - Various topics
2. **Mathematics** - Math problems and calculations
3. **Science** - Physics, Chemistry, Biology
4. **History** - Historical events and figures
5. **Geography** - World geography and landmarks
6. **Literature** - Books, authors, literary works
7. **Technology** - Computer science and technology
8. **Sports** - Sports trivia and facts
9. **Arts** - Art history and movements
10. **Current Affairs** - Recent news and events

## 🚀 Deployment

### Environment Variables

Create a `.env.local` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=myiq_db
```

### Build for Production

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**

- Ensure MySQL is running on localhost:3306
- Check username/password in `lib/database.ts`
- Verify database `myiq_db` exists

**Port Already in Use**

- Next.js will auto-assign available port (3001, 3002, etc.)
- Check terminal output for correct URL

**Module Not Found Errors**

- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `package-lock.json`, then reinstall

**Build Errors**

- Check TypeScript errors: `npm run build`
- Ensure all environment variables are set

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Check existing issues for solutions
- Review the setup documentation

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by [Your Name]
