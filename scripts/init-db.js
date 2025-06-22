const mysql = require("mysql2/promise");

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Update with your MySQL password
    port: 3306,
  });

  try {
    console.log("Connected to MySQL server");

    // Create database
    await connection.execute("CREATE DATABASE IF NOT EXISTS myiq_db");
    console.log("Database myiq_db created or already exists");

    await connection.execute("USE myiq_db");

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Users table created");

    // Create categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Categories table created");

    // Create questions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_text TEXT NOT NULL,
        option_a VARCHAR(255) NOT NULL,
        option_b VARCHAR(255) NOT NULL,
        option_c VARCHAR(255) NOT NULL,
        option_d VARCHAR(255) NOT NULL,
        correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
        category_id INT,
        difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    console.log("Questions table created");

    // Create quiz_sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quiz_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        category_id INT,
        total_questions INT NOT NULL,
        correct_answers INT NOT NULL,
        score_percentage DECIMAL(5,2) NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    console.log("Quiz sessions table created");

    // Create user_answers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_answers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id INT NOT NULL,
        question_id INT NOT NULL,
        user_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
        is_correct BOOLEAN NOT NULL,
        answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES quiz_sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
      )
    `);
    console.log("User answers table created");

    // Insert default categories
    await connection.execute(`
      INSERT IGNORE INTO categories (name, description) VALUES
      ('General Knowledge', 'General knowledge questions covering various topics'),
      ('Mathematics', 'Mathematical problems and calculations'),
      ('Science', 'Physics, Chemistry, Biology questions'),
      ('History', 'Historical events and figures'),
      ('Geography', 'World geography and landmarks'),
      ('Literature', 'Books, authors, and literary works'),
      ('Technology', 'Computer science and technology'),
      ('Sports', 'Sports trivia and facts'),
      ('Arts', 'Art history and artistic movements'),
      ('Current Affairs', 'Recent news and current events')
    `);
    console.log("Default categories inserted");

    console.log("Database initialization completed successfully!");
  } catch (error) {
    console.error("Database initialization error:", error);
  } finally {
    await connection.end();
  }
}

initializeDatabase();
