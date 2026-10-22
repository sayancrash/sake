#!/usr/bin/env python3
"""
UBT Prep LMS - Backend Server & SQLite Database
Handles student sign up, role management (student, teacher, admin), and course data.
"""

import http.server
import socketserver
import sqlite3
import json
import urllib.parse
import os
import sys
import hashlib
from datetime import datetime

PORT = 8000
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_FILE = os.path.join(BASE_DIR, 'database.db')

def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def hash_password(password: str) -> str:
    salt = "ubt_prep_2026_"
    return hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

def init_db():
    conn = get_db()
    cur = conn.cursor()

    # 1. Users Table (Core entity for Sign-up & Role Management)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
    );
    """)

    # 2. Courses Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS courses (
        course_id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        subject TEXT NOT NULL,
        difficulty TEXT DEFAULT 'intermediate',
        duration_hours INTEGER DEFAULT 12,
        rating_text TEXT DEFAULT '4.9 (150 reviews)'
    );
    """)

    # 3. Enrollments Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS enrollments (
        enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        progress_percent INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        UNIQUE (user_id, course_id),
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses (course_id) ON DELETE CASCADE
    );
    """)

    # 4. Assignments Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS assignments (
        assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        due_date TEXT NOT NULL,
        question TEXT,
        options_json TEXT,
        correct_answer INTEGER,
        FOREIGN KEY (course_id) REFERENCES courses (course_id) ON DELETE CASCADE
    );
    """)

    # 5. Submissions Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS submissions (
        submission_id INTEGER PRIMARY KEY AUTOINCREMENT,
        assignment_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        score INTEGER,
        status TEXT DEFAULT 'graded',
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignment_id) REFERENCES assignments (assignment_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
    );
    """)

    # Seed initial test data if users table is empty
    cur.execute("SELECT COUNT(*) as count FROM users")
    if cur.fetchone()['count'] == 0:
        # Seed 3 default accounts with distinct roles
        cur.execute("""
        INSERT INTO users (name, email, password_hash, role) VALUES
        ('Sayan Admin', 'admin@ubtprep.kz', ?, 'admin'),
        ('Dr. Askar Mathematics', 'teacher@ubtprep.kz', ?, 'instructor'),
        ('Aigerim Student', 'aigerim@student.ubt.kz', ?, 'student')
        """, (hash_password('admin123'), hash_password('teacher123'), hash_password('student123')))

        # Seed 5 courses
        cur.executemany("""
        INSERT INTO courses (slug, title, description, subject, duration_hours, rating_text) VALUES (?, ?, ?, ?, ?, ?)
        """, [
            ('mathematics', 'Mathematics', 'Algebra, geometry, functions, problem solving.', 'Mathematics', 15, '4.9 (185 reviews)'),
            ('informatics', 'Informatics', 'Algorithms, programming, databases, Python.', 'Informatics', 12, '4.8 (120 reviews)'),
            ('kazakhstan-history', 'Kazakhstan History', 'Key historical periods, important figures, events.', 'Kazakh History', 10, '4.7 (95 reviews)'),
            ('reading-literacy', 'Reading Literacy', 'Texts, analysis, comprehension, vocabulary.', 'Reading Literacy', 8, '4.8 (110 reviews)'),
            ('mathematical-literacy', 'Mathematical Literacy', 'Real-life problems, data, calculations, statistics.', 'Math Literacy', 8, '4.9 (140 reviews)')
        ])

        # Initial enrollment for Aigerim
        cur.execute("""
        INSERT INTO enrollments (user_id, course_id, progress_percent) VALUES (3, 1, 75), (3, 2, 40), (3, 3, 20)
        """)

        # Seed assignments
        cur.executemany("""
        INSERT INTO assignments (course_id, title, due_date, question, options_json, correct_answer) VALUES (?, ?, ?, ?, ?, ?)
        """, [
            (1, 'Algebra exercises', 'Due: Apr 28, 2026', 'Solve for x: 3x - 7 = 14', json.dumps(['x = 5', 'x = 7', 'x = 21', 'x = 3']), 1),
            (2, 'Loops and conditions', 'Due: Apr 30, 2026', 'What is the output of count = 0; for i in range(3): count += i; print(count)', json.dumps(['3', '6', '2', '0']), 0),
            (3, 'Key dates and events', 'Due: May 1, 2026', 'In which year was the Kazakh Khanate established by Kerey and Zhanibek?', json.dumps(['1465', '1206', '1723', '1991']), 0)
        ])

        print("[DB] Fresh database initialized with clean seed records.")

    conn.commit()
    conn.close()


class UBTHandler(http.server.SimpleHTTPRequestHandler):

    def send_json(self, data, status_code=200):
        body = json.dumps(data, default=str).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path.startswith('/api/'):
            self.handle_api_get(path, query)
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        if path.startswith('/api/'):
            self.handle_api_post(path, payload)
        else:
            self.send_error(404, "Not Found")

    # ----------------------------------------------------------------
    # API GET
    # ----------------------------------------------------------------
    def handle_api_get(self, path, query):
        conn = get_db()
        cur = conn.cursor()

        try:
            # 1. Health & Database Status
            if path == '/api/health':
                cur.execute("SELECT COUNT(*) as count FROM users")
                user_count = cur.fetchone()['count']
                self.send_json({
                    "status": "connected",
                    "database": "SQLite 3",
                    "file": "database.db",
                    "total_users": user_count
                })

            # 2. Get All Registered Users (For Role Management View)
            elif path == '/api/users':
                cur.execute("""
                SELECT user_id, name, email, role, created_at, last_login
                FROM users
                ORDER BY user_id DESC
                """)
                users = [dict(r) for r in cur.fetchall()]
                self.send_json({"success": True, "users": users})

            # 3. Courses List
            elif path == '/api/courses':
                cur.execute("SELECT * FROM courses ORDER BY course_id ASC")
                courses = [dict(r) for r in cur.fetchall()]
                self.send_json({"success": True, "courses": courses})

            # 4. Student Dashboard
            elif path == '/api/student/dashboard':
                user_id = query.get('user_id', ['3'])[0]
                cur.execute("SELECT user_id, name, email, role FROM users WHERE user_id = ?", (user_id,))
                user = cur.fetchone()

                cur.execute("""
                SELECT c.*, e.progress_percent, e.enrolled_at, e.status as enrollment_status
                FROM enrollments e
                JOIN courses c ON e.course_id = c.course_id
                WHERE e.user_id = ?
                """, (user_id,))
                enrolled = [dict(r) for r in cur.fetchall()]

                self.send_json({
                    "success": True,
                    "user": dict(user) if user else None,
                    "enrolled_courses": enrolled
                })

            # 5. Assignments
            elif path == '/api/assignments':
                user_id = query.get('user_id', ['3'])[0]
                cur.execute("""
                SELECT a.*, c.title as course_name, c.slug as course_slug,
                       s.submission_id, s.status as submission_status
                FROM assignments a
                JOIN courses c ON a.course_id = c.course_id
                LEFT JOIN submissions s ON a.assignment_id = s.assignment_id AND s.user_id = ?
                """, (user_id,))
                items = []
                for r in cur.fetchall():
                    d = dict(r)
                    if d.get('options_json'):
                        try:
                            d['options'] = json.loads(d['options_json'])
                        except:
                            d['options'] = []
                    d['is_completed'] = (d['submission_status'] is not None)
                    items.append(d)
                self.send_json({"success": True, "assignments": items})

            else:
                self.send_json({"error": "Unknown API endpoint"}, 404)

        except Exception as e:
            self.send_json({"error": str(e)}, 500)
        finally:
            conn.close()

    # ----------------------------------------------------------------
    # API POST
    # ----------------------------------------------------------------
    def handle_api_post(self, path, payload):
        conn = get_db()
        cur = conn.cursor()

        try:
            # 1. Sign Up (Register New Student / Teacher / Admin)
            if path == '/api/auth/register':
                name = payload.get('name', '').strip()
                email = payload.get('email', '').strip().lower()
                password = payload.get('password', 'password123')
                role = payload.get('role', 'student').strip().lower()

                # Validate role
                if role not in ('student', 'instructor', 'admin'):
                    role = 'student'

                if not name or not email:
                    self.send_json({"success": False, "message": "Name and email are required"}, 400)
                    return

                # Check unique email
                cur.execute("SELECT user_id FROM users WHERE LOWER(email) = ?", (email,))
                if cur.fetchone():
                    self.send_json({"success": False, "message": "An account with this email already exists"}, 409)
                    return

                # Save into database with exact timestamp
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cur.execute("""
                INSERT INTO users (name, email, password_hash, role, created_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                """, (name, email, hash_password(password), role))
                conn.commit()
                new_user_id = cur.lastrowid

                # If student, enroll in initial course
                if role == 'student':
                    cur.execute("INSERT OR IGNORE INTO enrollments (user_id, course_id, enrolled_at, progress_percent) VALUES (?, 1, CURRENT_TIMESTAMP, 0)", (new_user_id,))
                    conn.commit()

                self.send_json({
                    "success": True,
                    "message": f"Successfully registered '{name}' as '{role.upper()}'! Saved to database on {now_str}",
                    "user": {
                        "user_id": new_user_id,
                        "name": name,
                        "email": email,
                        "role": role,
                        "created_at": now_str
                    }
                })

            # 2. Update User Role (Должность өзгерту: student, instructor, admin)
            elif path == '/api/users/update-role':
                user_id = payload.get('user_id')
                new_role = payload.get('role', '').strip().lower()

                if new_role not in ('student', 'instructor', 'admin'):
                    self.send_json({"success": False, "message": "Invalid role. Must be 'student', 'instructor', or 'admin'"}, 400)
                    return

                cur.execute("SELECT name, email, role FROM users WHERE user_id = ?", (user_id,))
                user = cur.fetchone()
                if not user:
                    self.send_json({"success": False, "message": "User not found"}, 404)
                    return

                # Update role in database
                cur.execute("UPDATE users SET role = ? WHERE user_id = ?", (new_role, user_id))
                conn.commit()

                self.send_json({
                    "success": True,
                    "message": f"Updated {user['name']}'s role from '{user['role'].upper()}' to '{new_role.upper()}' in database.db!",
                    "user_id": user_id,
                    "new_role": new_role
                })

            # 3. Delete User (For clean testing)
            elif path == '/api/users/delete':
                user_id = payload.get('user_id')
                cur.execute("DELETE FROM users WHERE user_id = ?", (user_id,))
                conn.commit()
                self.send_json({"success": True, "message": f"User #{user_id} deleted from database."})

            # 4. User Login
            elif path == '/api/auth/login':
                email = payload.get('email', '').strip().lower()
                password = payload.get('password', '')

                cur.execute("SELECT * FROM users WHERE LOWER(email) = ?", (email,))
                user = cur.fetchone()

                if not user:
                    self.send_json({"success": False, "message": "User not found with this email"}, 401)
                    return

                # Update last login
                cur.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?", (user['user_id'],))
                conn.commit()

                user_data = dict(user)
                del user_data['password_hash']
                self.send_json({
                    "success": True,
                    "message": f"Welcome back, {user['name']} ({user['role'].upper()})!",
                    "user": user_data
                })

            # 5. Assignment Submit
            elif path == '/api/assignments/submit':
                user_id = payload.get('user_id', 3)
                assignment_id = payload.get('assignment_id')
                cur.execute("""
                INSERT INTO submissions (assignment_id, user_id, score, status, submitted_at)
                VALUES (?, ?, 100, 'graded', CURRENT_TIMESTAMP)
                """, (assignment_id, user_id))
                conn.commit()
                self.send_json({"success": True, "message": "Assignment submission recorded in database!"})

            else:
                self.send_json({"error": "Unknown API endpoint"}, 404)

        except Exception as e:
            self.send_json({"error": str(e)}, 500)
        finally:
            conn.close()


def run():
    init_db()
    os.chdir(BASE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), UBTHandler) as httpd:
        print("=" * 65)
        print(f"🚀 UBT Prep Database Server Running on http://localhost:{PORT}")
        print(f"📁 Database: {DB_FILE} (Clean SQLite 3)")
        print("✨ Features: Sign-up into Database + Live Role Editor (Student/Teacher/Admin)")
        print("=" * 65)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == '__main__':
    run()
