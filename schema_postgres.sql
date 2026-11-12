-- =========================================================================
-- UBT Prep — PostgreSQL 15+ Enterprise Relational Database Schema
-- Architecture: 3NF Normalized, Strict Constraints, High Concurrency (MVCC)
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM Type for User Positions (Roles)
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');

-- 2. USERS TABLE (Core Entity for Sign-Up & Role-Based Access Control)
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash CHAR(64) NOT NULL, -- Salted SHA-256 hash
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ
);

-- Index for fast user authentication & email lookups
CREATE INDEX idx_users_email ON users(email);

-- 3. COURSES TABLE (5 Core UNT Subjects)
CREATE TABLE IF NOT EXISTS courses (
    course_id SERIAL PRIMARY KEY,
    slug VARCHAR(60) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    subject VARCHAR(100) NOT NULL,
    duration_hours INT DEFAULT 12,
    rating_text VARCHAR(50) DEFAULT '4.9 (150 reviews)'
);

-- 4. ENROLLMENTS TABLE (Many-to-Many: Students & Courses)
CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    enrolled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    UNIQUE (user_id, course_id)
);

-- Index for fast student dashboard queries
CREATE INDEX idx_enrollments_user ON enrollments(user_id);

-- 5. ASSIGNMENTS TABLE (UNT Mock Test Questions with Native JSONB)
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    due_date VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Native PostgreSQL JSONB: ["Option A", "Option B", "Option C", "Option D"]
    correct_answer INT NOT NULL CHECK (correct_answer >= 0)
);

-- 6. SUBMISSIONS TABLE (Student Scores & Evaluation)
CREATE TABLE IF NOT EXISTS submissions (
    submission_id SERIAL PRIMARY KEY,
    assignment_id INT NOT NULL REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 0),
    status VARCHAR(30) DEFAULT 'graded',
    submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- INITIAL SEED DATA
-- =========================================================================

-- Seed Users with Distinct Roles
INSERT INTO users (name, email, password_hash, role) VALUES
('Sayan Admin', 'admin@ubtprep.kz', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'admin'),
('Dr. Askar Mathematics', 'teacher@ubtprep.kz', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'instructor'),
('Aigerim Student', 'aigerim@student.ubt.kz', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'student')
ON CONFLICT (email) DO NOTHING;

-- Seed Courses
INSERT INTO courses (slug, title, description, subject, duration_hours, rating_text) VALUES
('mathematics', 'Mathematics', 'Algebra, geometry, functions, problem solving.', 'Mathematics', 15, '4.9 (185 reviews)'),
('informatics', 'Informatics', 'Algorithms, Python programming, relational databases.', 'Informatics', 12, '4.8 (120 reviews)'),
('kazakhstan-history', 'Kazakhstan History', 'Key historical periods, Kazakh Khanate to Independence.', 'Kazakh History', 10, '4.7 (95 reviews)'),
('reading-literacy', 'Reading Literacy', 'Text analysis, reading comprehension, critical thinking.', 'Reading Literacy', 8, '4.8 (110 reviews)'),
('mathematical-literacy', 'Mathematical Literacy', 'Real-life practical math, applied logic, statistics.', 'Math Literacy', 8, '4.9 (140 reviews)')
ON CONFLICT (slug) DO NOTHING;

-- Seed Mock Exam Questions with JSONB
INSERT INTO assignments (course_id, title, due_date, question, options, correct_answer) VALUES
(1, 'Algebra & Equations', 'Due: Nov 20, 2026', 'Solve for x: 3x - 7 = 14', '["x = 5", "x = 7", "x = 21", "x = 3"]'::jsonb, 1),
(2, 'Python Loops & Algorithms', 'Due: Nov 25, 2026', 'What is the output of count = 0; for i in range(3): count += i; print(count)?', '["3", "6", "2", "0"]'::jsonb, 0),
(3, 'Kazakh Khanate Foundations', 'Due: Nov 30, 2026', 'In which year was the Kazakh Khanate established by Kerey and Zhanibek?', '["1465", "1206", "1723", "1991"]'::jsonb, 0);

