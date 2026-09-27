/**
 * UBT Prep - Educational Platform Client Script
 * Powers the 6 screens matching the design specification:
 * 1. Home page — басты бет
 * 2. Login / Sign up — кіру және тіркелу
 * 3. Courses — курстар тізімі
 * 4. Course details — курс туралы толық ақпарат
 * 5. Student dashboard — студенттің жеке кабинеті
 * 6. Progress / Assignments — тапсырмалар мен үлгерім
 */

// Application State
const AppState = {
  currentUser: {
    name: 'Aigerim',
    role: 'Student',
    email: 'aigerim@student.ubt.kz',
    isLoggedIn: false
  },
  currentScreen: 'screen-home',
  currentCourseId: 'informatics',
  assignmentFilter: 'upcoming',
  courseDetailsTab: 'overview',
  overallProgress: 60,
  wishlist: new Set(),
  
  // Courses Data (Screens 1, 3, 4, 5)
  courses: [
    {
      id: 'mathematics',
      title: 'Mathematics',
      desc: 'Algebra, geometry, functions, problem solving.',
      icon: 'calculator',
      lessonsCount: '12 lessons >',
      totalLessons: 12,
      duration: '12 lessons (~15 hours)',
      level: 'Beginner - Advanced',
      language: 'English / Kazakh',
      certificate: 'Included',
      rating: '4.9 (185 reviews)',
      progress: 75,
      about: 'Comprehensive preparation for the National University Test in Mathematics. Covers core algebraic concepts, analytical geometry, trigonometry, functions, and rapid problem-solving strategies.',
      whatYouLearn: [
        'Algebraic expressions, equations & inequalities',
        'Functions, graphs and analytical calculus',
        'Plane and solid geometry theorems',
        'High-scoring test heuristics & shortcuts'
      ],
      lessons: [
        { id: 1, title: 'Linear Equations & Systems', duration: '45 min', done: true },
        { id: 2, title: 'Quadratic Functions & Parabola', duration: '55 min', done: true },
        { id: 3, title: 'Logarithms & Exponents', duration: '50 min', done: true },
        { id: 4, title: 'Trigonometric Identities', duration: '60 min', done: true },
        { id: 5, title: 'Vectors and Coordinate Plane', duration: '40 min', done: false }
      ]
    },
    {
      id: 'informatics',
      title: 'Informatics',
      desc: 'Algorithms, programming, databases.',
      icon: 'code',
      lessonsCount: '10 lessons >',
      totalLessons: 10,
      duration: '10 lessons (~12 hours)',
      level: 'Beginner - Advanced',
      language: 'English',
      certificate: 'Included',
      rating: '4.8 (120 reviews)',
      progress: 40,
      about: 'This course covers the main topics of informatics required for the UNT. You will learn programming basics, algorithms, data structures and more through practical examples and exercises.',
      whatYouLearn: [
        'Programming basics (Python)',
        'Algorithms and problem solving',
        'Data structures',
        'Practice tests and real tasks'
      ],
      lessons: [
        { id: 1, title: 'Introduction to Python & Data Types', duration: '45 min', done: true },
        { id: 2, title: 'Conditional Statements & Boolean Logic', duration: '50 min', done: true },
        { id: 3, title: 'Loops: For and While iterations', duration: '55 min', done: true },
        { id: 4, title: 'Strings, Lists and Indexing', duration: '60 min', done: true },
        { id: 5, title: 'Functions and Recursion', duration: '50 min', done: false },
        { id: 6, title: 'Basic Search & Sort Algorithms', duration: '65 min', done: false },
        { id: 7, title: 'Relational Databases & SQL queries', duration: '55 min', done: false },
        { id: 8, title: 'Computer Architecture & Networks', duration: '40 min', done: false }
      ]
    },
    {
      id: 'kazakhstan-history',
      title: 'Kazakhstan History',
      desc: 'Key historical periods, important figures, events.',
      icon: 'temple',
      lessonsCount: '10 lessons >',
      totalLessons: 10,
      duration: '10 lessons (~10 hours)',
      level: 'Beginner - Advanced',
      language: 'Kazakh / English',
      certificate: 'Included',
      rating: '4.7 (95 reviews)',
      progress: 20,
      about: 'Structured chronological review of the history of Kazakhstan, from ancient Saka and Hun nomadic civilizations to the Kazakh Khanate and modern independence.',
      whatYouLearn: [
        'Nomadic civilizations & Silk Road history',
        'Formation and consolidation of Kazakh Khanate',
        '19th - 20th century movements & Alash Orda',
        'State sovereignty and modern foreign relations'
      ],
      lessons: [
        { id: 1, title: 'Ancient nomadic tribes: Saka, Sarmat, Kangly', duration: '40 min', done: true },
        { id: 2, title: 'Turkic Khaganates & Medieval cities', duration: '45 min', done: true },
        { id: 3, title: 'Formation of the Kazakh Khanate', duration: '55 min', done: false }
      ]
    },
    {
      id: 'reading-literacy',
      title: 'Reading Literacy',
      desc: 'Texts, analysis, comprehension, vocabulary.',
      icon: 'book',
      lessonsCount: '8 lessons >',
      totalLessons: 8,
      duration: '8 lessons (~8 hours)',
      level: 'Beginner - Intermediate',
      language: 'English',
      certificate: 'Included',
      rating: '4.8 (110 reviews)',
      progress: 10,
      about: 'Master critical reading skills, author intent analysis, textual synthesis, and contextual inference to maximize points in the Reading Literacy UNT section.',
      whatYouLearn: [
        'Skimming and targeted scanning techniques',
        'Identifying primary arguments and subtext',
        'Vocabulary from context clues',
        'Comparative multi-passage questions'
      ],
      lessons: [
        { id: 1, title: 'Finding Main Idea & Topic Sentences', duration: '35 min', done: true },
        { id: 2, title: 'Inference and Deduction Strategies', duration: '45 min', done: false }
      ]
    },
    {
      id: 'mathematical-literacy',
      title: 'Mathematical Literacy',
      desc: 'Real-life problems, data, calculations.',
      icon: 'chart',
      lessonsCount: '8 lessons >',
      totalLessons: 8,
      duration: '8 lessons (~8 hours)',
      level: 'Beginner - Intermediate',
      language: 'Kazakh / English',
      certificate: 'Included',
      rating: '4.9 (140 reviews)',
      progress: 5,
      about: 'Practical logic and mathematical problem solving for real-world scenarios: tables, charts, statistical distributions, permutations, and spatial logic.',
      whatYouLearn: [
        'Interpreting tables, pie charts & bar graphs',
        'Logical reasoning and combinatorics',
        'Percentages, interest and financial calculations',
        'Time, speed, work and distance word problems'
      ],
      lessons: [
        { id: 1, title: 'Graph and Table Interpretation', duration: '40 min', done: true },
        { id: 2, title: 'Logic Riddles and Pattern Matching', duration: '45 min', done: false }
      ]
    }
  ],

  // Assignments Data (Screen 6)
  assignments: [
    {
      id: 'assign-1',
      title: 'Algebra exercises',
      courseName: 'Mathematics',
      dueDate: 'Due: Apr 28, 2025',
      icon: 'calculator',
      status: 'upcoming',
      question: 'Solve for x: 3x - 7 = 14',
      options: ['x = 5', 'x = 7', 'x = 21', 'x = 3'],
      correctAnswer: 1
    },
    {
      id: 'assign-2',
      title: 'Loops and conditions',
      courseName: 'Informatics',
      dueDate: 'Due: Apr 30, 2025',
      icon: 'code',
      status: 'upcoming',
      question: 'What is the output of:\ncount = 0\nfor i in range(3):\n    count += i\nprint(count)',
      options: ['3', '6', '2', '0'],
      correctAnswer: 0
    },
    {
      id: 'assign-3',
      title: 'Key dates and events',
      courseName: 'History of Kazakhstan',
      dueDate: 'Due: May 1, 2025',
      icon: 'temple',
      status: 'upcoming',
      question: 'In which year was the Kazakh Khanate established by Kerey and Zhanibek?',
      options: ['1465', '1206', '1723', '1991'],
      correctAnswer: 0
    },
    {
      id: 'assign-4',
      title: 'Text analysis',
      courseName: 'Reading Literacy',
      dueDate: 'Due: May 5, 2025',
      icon: 'book',
      status: 'upcoming',
      question: 'What does "reading between the lines" mean in critical reading comprehension?',
      options: ['Skipping alternating lines', 'Inferring implicit meaning not explicitly stated', 'Memorizing every word', 'Reading at double speed'],
      correctAnswer: 1
    },
    {
      id: 'assign-5',
      title: 'Data interpretation',
      courseName: 'Mathematical Literacy',
      dueDate: 'Due: May 8, 2025',
      icon: 'chart',
      status: 'upcoming',
      question: 'If a store offers a 20% discount on a 15,000 KZT item, what is the final price?',
      options: ['12,000 KZT', '13,000 KZT', '11,500 KZT', '12,500 KZT'],
      correctAnswer: 0
    },
    {
      id: 'assign-6',
      title: 'Python syntax basics',
      courseName: 'Informatics',
      dueDate: 'Completed on Apr 15, 2025',
      icon: 'code',
      status: 'completed',
      question: 'Which symbol is used for comments in Python?',
      options: ['#', '//', '/*', '<!--'],
      correctAnswer: 0
    },
    {
      id: 'assign-7',
      title: 'Saka tribes overview',
      courseName: 'History of Kazakhstan',
      dueDate: 'Completed on Apr 18, 2025',
      icon: 'temple',
      status: 'completed',
      question: 'What prominent archaeological artifact is attributed to Saka culture?',
      options: ['The Golden Man (Altyn Adam)', 'Rosetta Stone', 'Code of Hammurabi', 'Terracotta Army'],
      correctAnswer: 0
    }
  ]
};

// DOM Initializer
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  setupRouting();
  renderCoursesList();
  renderDashboardCourses();
  renderAssignments();
  setupEventListeners();
  updateAuthUI();
});

// Populate SVG icons across data-icon attributes
function initIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const iconName = el.getAttribute('data-icon');
    if (Icons[iconName]) {
      el.innerHTML = Icons[iconName];
    }
  });
}

// Router & Screen Switcher
function showScreen(screenId) {
  AppState.currentScreen = screenId;
  
  // Hide all screens
  document.querySelectorAll('.view-container').forEach(view => {
    view.classList.remove('active-view');
  });
  
  // Show target screen
  const targetView = document.getElementById(screenId);
  if (targetView) {
    targetView.classList.add('active-view');
  }

  // Update top screen switcher buttons
  document.querySelectorAll('.screen-btn').forEach(btn => {
    if (btn.getAttribute('data-screen') === screenId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update top main navigation active states
  document.querySelectorAll('.site-header .nav-item').forEach(item => {
    const navLink = item.getAttribute('data-nav');
    item.classList.remove('active');
    if (screenId === 'screen-home' && navLink === 'home') item.classList.add('active');
    if ((screenId === 'screen-courses' || screenId === 'screen-course-details') && navLink === 'courses') item.classList.add('active');
  });

  // Update sidebar active states if inside app shell screens
  updateSidebarActive(screenId);

  // If entering Course Details, make sure course content is rendered
  if (screenId === 'screen-course-details') {
    renderCourseDetails(AppState.currentCourseId);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update sidebar active links
function updateSidebarActive(screenId) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    const target = link.getAttribute('data-target-screen');
    if (target === screenId) {
      link.classList.add('active');
    }
  });
}

// Setup Event Listeners for buttons and navigation
function setupRouting() {
  document.querySelectorAll('.screen-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.getAttribute('data-screen');
      if (screen) showScreen(screen);
    });
  });

  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-route');
      if (target) showScreen(target);
    });
  });
}

// =====================================================================
// SCREEN 3: COURSES LIST & SEARCH/FILTER
// =====================================================================
function renderCoursesList(filterKeyword = '', subjectFilter = 'all') {
  const container = document.getElementById('courses-list-container');
  if (!container) return;

  const filtered = AppState.courses.filter(course => {
    const matchKeyword = course.title.toLowerCase().includes(filterKeyword.toLowerCase()) ||
                         course.desc.toLowerCase().includes(filterKeyword.toLowerCase());
    const matchSubject = subjectFilter === 'all' || course.id === subjectFilter;
    return matchKeyword && matchSubject;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 48px; text-align: center; color: var(--text-muted); background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg);">
        <p style="font-size: 15px; font-weight: 500;">No courses found matching your search.</p>
        <button class="btn btn-outline btn-sm" style="margin-top: 12px;" onclick="resetCourseSearch()">Clear Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(course => `
    <div class="course-item-card" onclick="openCourseDetails('${course.id}')">
      <div class="course-item-left">
        <div class="course-item-icon-box">
          ${Icons[course.icon] || Icons.code}
        </div>
        <div class="course-item-info">
          <div class="course-item-title">${course.title}</div>
          <div class="course-item-desc">${course.desc}</div>
        </div>
      </div>
      <div class="course-item-right">
        <span class="course-item-lessons">
          ${course.lessonsCount}
        </span>
      </div>
    </div>
  `).join('');
}

function resetCourseSearch() {
  const searchInput = document.getElementById('course-search-input');
  const subjectSelect = document.getElementById('course-subject-select');
  if (searchInput) searchInput.value = '';
  if (subjectSelect) subjectSelect.value = 'all';
  renderCoursesList('', 'all');
}

// =====================================================================
// SCREEN 4: COURSE DETAILS
// =====================================================================
function openCourseDetails(courseId) {
  AppState.currentCourseId = courseId;
  renderCourseDetails(courseId);
  showScreen('screen-course-details');
}

function renderCourseDetails(courseId) {
  const course = AppState.courses.find(c => c.id === courseId) || AppState.courses[1];
  
  const iconEl = document.getElementById('course-details-icon');
  if (iconEl) iconEl.innerHTML = Icons[course.icon] || Icons.code;

  const titleEl = document.getElementById('course-details-title');
  if (titleEl) titleEl.textContent = course.title;

  const descEl = document.getElementById('course-details-desc');
  if (descEl) descEl.textContent = course.desc;

  const lessonsBadge = document.getElementById('course-meta-lessons');
  if (lessonsBadge) lessonsBadge.textContent = `${course.totalLessons} lessons`;

  const levelBadge = document.getElementById('course-meta-level');
  if (levelBadge) levelBadge.textContent = course.level;

  const ratingBadge = document.getElementById('course-meta-rating');
  if (ratingBadge) ratingBadge.innerHTML = `${Icons.star} ${course.rating}`;

  const aboutEl = document.getElementById('course-details-about');
  if (aboutEl) aboutEl.textContent = course.about;

  const learnListEl = document.getElementById('course-learn-list');
  if (learnListEl) {
    learnListEl.innerHTML = course.whatYouLearn.map(item => `
      <li class="learn-list-item">
        <span class="learn-check-icon">${Icons.check}</span>
        <span>${item}</span>
      </li>
    `).join('');
  }

  // Sidebar Specs
  const specDuration = document.getElementById('spec-duration');
  if (specDuration) specDuration.textContent = course.duration;

  const specLevel = document.getElementById('spec-level');
  if (specLevel) specLevel.textContent = course.level;

  const specLanguage = document.getElementById('spec-language');
  if (specLanguage) specLanguage.textContent = course.language;

  const specCertificate = document.getElementById('spec-certificate');
  if (specCertificate) specCertificate.textContent = course.certificate;

  // Wishlist Button state
  const wishlistBtn = document.getElementById('btn-add-wishlist');
  if (wishlistBtn) {
    const isSaved = AppState.wishlist.has(course.id);
    wishlistBtn.innerHTML = `${Icons.bookmark} <span>${isSaved ? 'In Wishlist' : 'Add to wishlist'}</span>`;
    wishlistBtn.style.backgroundColor = isSaved ? '#F3F4F6' : '#FFFFFF';
  }
}

// Lesson Viewer Modal for Screen 4 "Start Course"
function openLessonViewer() {
  const course = AppState.courses.find(c => c.id === AppState.currentCourseId) || AppState.courses[1];
  const modalOverlay = document.getElementById('lesson-modal');
  const titleEl = document.getElementById('lesson-modal-title');
  const listEl = document.getElementById('lesson-modal-list');

  titleEl.textContent = `${course.title} — Syllabus & Lessons`;
  listEl.innerHTML = course.lessons.map(l => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 8px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="color: ${l.done ? '#10B981' : '#9CA3AF'}">${l.done ? Icons.checkCircle : Icons.clock}</span>
        <div>
          <div style="font-size: 14px; font-weight: 600;">Lesson ${l.id}: ${l.title}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${l.duration}</div>
        </div>
      </div>
      <button class="btn ${l.done ? 'btn-outline' : 'btn-primary'} btn-sm" onclick="showToast('Playing Lesson ${l.id}: ${l.title}')">
        ${l.done ? 'Replay' : 'Play'}
      </button>
    </div>
  `).join('');

  modalOverlay.classList.add('show');
}

function closeLessonViewer() {
  const modal = document.getElementById('lesson-modal');
  if (modal) modal.classList.remove('show');
}

// About Modal
function openAboutModal() {
  const modal = document.getElementById('about-modal');
  if (modal) modal.classList.add('show');
}

function closeAboutModal() {
  const modal = document.getElementById('about-modal');
  if (modal) modal.classList.remove('show');
}



// Toggle Wishlist on Course Details
function toggleWishlist() {
  const courseId = AppState.currentCourseId;
  if (AppState.wishlist.has(courseId)) {
    AppState.wishlist.delete(courseId);
    showToast('Removed from wishlist');
  } else {
    AppState.wishlist.add(courseId);
    showToast('Added to wishlist!');
  }
  renderCourseDetails(courseId);
}

// Switch tabs on Screen 4 Course Details
function switchCourseDetailsTab(tabName) {
  AppState.courseDetailsTab = tabName;
  document.querySelectorAll('.course-tab-item').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
  });

  const overviewSection = document.getElementById('tab-content-overview');
  const lessonsSection = document.getElementById('tab-content-lessons');
  const resourcesSection = document.getElementById('tab-content-resources');
  const reviewsSection = document.getElementById('tab-content-reviews');

  if (overviewSection) overviewSection.style.display = tabName === 'overview' ? 'grid' : 'none';
  if (lessonsSection) lessonsSection.style.display = tabName === 'lessons' ? 'block' : 'none';
  if (resourcesSection) resourcesSection.style.display = tabName === 'resources' ? 'block' : 'none';
  if (reviewsSection) reviewsSection.style.display = tabName === 'reviews' ? 'block' : 'none';
}

// =====================================================================
// SCREEN 5: STUDENT DASHBOARD
// =====================================================================
function renderDashboardCourses() {
  const container = document.getElementById('dashboard-courses-list');
  if (!container) return;

  container.innerHTML = AppState.courses.map(course => `
    <div class="my-course-row">
      <div class="my-course-left">
        <div class="my-course-icon-box">
          ${Icons[course.icon] || Icons.code}
        </div>
        <div class="my-course-title">${course.title}</div>
      </div>
      <div class="my-course-center">
        <div class="progress-track">
          <div class="progress-fill" style="width: ${course.progress}%"></div>
        </div>
        <div class="progress-number">${course.progress}%</div>
      </div>
      <div class="my-course-right">
        <button class="btn btn-primary btn-sm" onclick="continueCourse('${course.id}')">Continue</button>
      </div>
    </div>
  `).join('');
}

function continueCourse(courseId) {
  openCourseDetails(courseId);
}

// =====================================================================
// SCREEN 6: ASSIGNMENTS & PROGRESS
// =====================================================================
function renderAssignments() {
  const container = document.getElementById('assignments-list-container');
  if (!container) return;

  const filter = AppState.assignmentFilter;
  const filtered = AppState.assignments.filter(item => {
    if (filter === 'upcoming') return item.status === 'upcoming';
    if (filter === 'completed') return item.status === 'completed';
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text-muted); background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-lg);">
        <p style="font-size: 14px;">No assignments in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="assignment-item-row">
      <div class="assignment-left">
        <div class="assignment-icon-box">
          ${Icons[item.icon] || Icons.assignment}
        </div>
        <div class="assignment-info">
          <div class="assignment-title">${item.title}</div>
          <div class="assignment-course-name">${item.courseName}</div>
          <div class="assignment-due-date">${item.dueDate}</div>
        </div>
      </div>
      <div class="assignment-right">
        ${item.status === 'completed'
          ? `<span class="badge-completed">${Icons.check} Done</span>`
          : `<button class="btn btn-primary btn-sm" onclick="startAssignment('${item.id}')">Start</button>`
        }
      </div>
    </div>
  `).join('');

  updateOverallProgressBar();
}

function updateOverallProgressBar() {
  const total = AppState.assignments.length;
  const completed = AppState.assignments.filter(a => a.status === 'completed').length;
  const percent = Math.round((completed / total) * 100);
  AppState.overallProgress = percent;

  const fillEl = document.getElementById('overall-progress-fill');
  const textEl = document.getElementById('overall-progress-percent');
  if (fillEl) fillEl.style.width = `${percent}%`;
  if (textEl) textEl.textContent = `${percent}%`;
}

// Interactive Assignment Modal
let activeAssignment = null;

function startAssignment(assignmentId) {
  const item = AppState.assignments.find(a => a.id === assignmentId);
  if (!item) return;

  activeAssignment = item;

  const modalOverlay = document.getElementById('assignment-modal');
  const titleEl = document.getElementById('modal-assign-title');
  const courseEl = document.getElementById('modal-assign-course');
  const questionEl = document.getElementById('modal-assign-question');
  const optionsEl = document.getElementById('modal-assign-options');

  titleEl.textContent = item.title;
  courseEl.textContent = `${item.courseName} • ${item.dueDate}`;
  questionEl.textContent = item.question;

  optionsEl.innerHTML = item.options.map((opt, idx) => `
    <label style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 10px; cursor: pointer; transition: var(--transition);" class="option-label" onclick="selectOption(this)">
      <input type="radio" name="assignment-option" value="${idx}" style="accent-color: #111827; width: 16px; height: 16px;">
      <span style="font-size: 14px; font-weight: 500;">${opt}</span>
    </label>
  `).join('');

  modalOverlay.classList.add('show');
}

function selectOption(labelEl) {
  document.querySelectorAll('.option-label').forEach(l => {
    l.style.borderColor = 'var(--border-light)';
    l.style.backgroundColor = 'transparent';
  });
  labelEl.style.borderColor = '#111827';
  labelEl.style.backgroundColor = '#F9FAFB';
  const radio = labelEl.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

function closeAssignmentModal() {
  const modalOverlay = document.getElementById('assignment-modal');
  if (modalOverlay) modalOverlay.classList.remove('show');
  activeAssignment = null;
}

function submitAssignmentAnswer() {
  if (!activeAssignment) return;
  
  const checked = document.querySelector('input[name="assignment-option"]:checked');
  if (!checked) {
    showToast('Please select an answer first.');
    return;
  }

  activeAssignment.status = 'completed';
  activeAssignment.dueDate = 'Completed just now';

  const course = AppState.courses.find(c => c.title.toLowerCase().includes(activeAssignment.courseName.toLowerCase()));
  if (course && course.progress < 100) {
    course.progress = Math.min(100, course.progress + 15);
  }

  closeAssignmentModal();
  renderAssignments();
  renderDashboardCourses();
  showToast(`Great job! Assignment "${activeAssignment.title}" completed!`);
}

// Authentication simulation
function loginUser(userName = 'Aigerim', email = 'aigerim@student.ubt.kz') {
  AppState.currentUser.name = userName;
  AppState.currentUser.email = email;
  AppState.currentUser.isLoggedIn = true;
  updateAuthUI();
  showToast(`Welcome back, ${userName}!`);
  showScreen('screen-dashboard');
}

function logoutUser() {
  AppState.currentUser.isLoggedIn = false;
  updateAuthUI();
  showToast('Logged out successfully');
  showScreen('screen-home');
}

function updateAuthUI() {
  const authBtns = document.getElementById('header-auth-buttons');
  const userBtn = document.getElementById('header-user-avatar');
  
  if (AppState.currentUser.isLoggedIn) {
    if (authBtns) authBtns.style.display = 'none';
    if (userBtn) userBtn.style.display = 'flex';
  } else {
    if (authBtns) authBtns.style.display = 'flex';
    if (userBtn) userBtn.style.display = 'none';
  }
}

let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const text = document.getElementById('toast-message');
  if (!toast || !text) return;

  text.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function setupEventListeners() {
  const searchInput = document.getElementById('course-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const subject = document.getElementById('course-subject-select')?.value || 'all';
      renderCoursesList(e.target.value, subject);
    });
  }

  const subjectSelect = document.getElementById('course-subject-select');
  if (subjectSelect) {
    subjectSelect.addEventListener('change', (e) => {
      const keyword = document.getElementById('course-search-input')?.value || '';
      renderCoursesList(keyword, e.target.value);
    });
  }

  document.querySelectorAll('.assignment-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.assignment-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.assignmentFilter = btn.getAttribute('data-filter') || 'upcoming';
      renderAssignments();
    });
  });

  document.querySelectorAll('.course-tab-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchCourseDetailsTab(tab);
    });
  });

  const avatarBtn = document.getElementById('header-user-avatar');
  const userDropdown = document.getElementById('user-dropdown-menu');
  if (avatarBtn && userDropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => {
      userDropdown.classList.remove('show');
    });
  }

  document.querySelectorAll('.input-toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email').value || 'Aigerim';
      loginUser(emailInput.split('@')[0], emailInput);
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('signup-name').value || 'New Student';
      const emailInput = document.getElementById('signup-email').value || 'student@ubt.kz';
      loginUser(nameInput, emailInput);
    });
  }

  // Close modals on clicking backdrop outside modal-box
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('show');
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
    }
  });
}
