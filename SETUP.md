# MyIQ Quiz Application Setup Guide

## Prerequisites

1. **MySQL Database**: Make sure you have MySQL installed and running on localhost:3306
2. **Node.js**: Ensure you have Node.js installed

## Database Setup

1. Start your MySQL server
2. Run the database initialization script:

   ```bash
   node scripts/init-db.js
   ```

3. Or manually create the database:
   - Create database named `myiq_db`
   - The application will auto-create tables on first API call

## Configuration

1. Update database credentials in `lib/database.ts`:
   ```typescript
   const dbConfig = {
     host: "localhost",
     user: "root",
     password: "YOUR_MYSQL_PASSWORD", // Update this
     database: "myiq_db",
     port: 3306,
   };
   ```

## Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open http://localhost:3001 (or the port shown in the terminal)

## Features

### Authentication

- **Register**: Create a new account with username, email, and password
- **Login**: Sign in with email and password
- **Auto-login**: Remembers your session using JWT tokens

### Quiz System

- **Take Quizzes**: Select a category and take 10 random questions
- **Real-time Scoring**: Get immediate feedback and final score
- **Multiple Categories**: Choose from 10 different quiz categories

### Admin Panel

- **Dashboard**: View system statistics
- **Add Questions**: Create new quiz questions with multiple categories
- **Question Management**: Organize questions by difficulty and category
- **User Management**: View user accounts and quiz history

### Database Integration

- **MySQL Storage**: All data stored in localhost MySQL database
- **Session Tracking**: Track quiz sessions and user answers
- **Score History**: Maintain complete quiz history for each user

## Database Schema

The application creates these tables automatically:

- `users` - User accounts and authentication
- `categories` - Quiz categories (pre-populated with 10 categories)
- `questions` - Quiz questions with multiple choice answers
- `quiz_sessions` - Individual quiz attempts
- `user_answers` - Detailed answer tracking

## Default Categories

1. General Knowledge
2. Mathematics
3. Science
4. History
5. Geography
6. Literature
7. Technology
8. Sports
9. Arts
10. Current Affairs

## Usage Flow

1. **First Time**: Register a new account
2. **Login**: Use your credentials to access the dashboard
3. **Add Questions**: Go to "Add Questions" to create quiz content
4. **Take Quiz**: Use "Take Quiz" to test yourself
5. **View Results**: Check your scores and progress

## Troubleshooting

- **Database Connection**: Ensure MySQL is running and credentials are correct
- **Port Issues**: Check that port 3001 is available
- **Module Errors**: Run `npm install` to ensure all dependencies are installed

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection protection with parameterized queries
- Client-side token validation
