// Prevent Back Navigation
// window.history.forward();
// setTimeout(() => window.history.forward(), 0);
// window.onunload = () => null;
// history.pushState(null, null, location.href);
// window.onpopstate = () => history.pushState(null, null, location.href);

// Questions Data
const questions = [
  { id: 1, question: "What is the capital of France?", options: ["Madrid", "Berlin", "Paris", "London"], answer: "Paris" },
  { id: 2, question: "2 + 2 equals?", options: ["3", "4", "5", "2"], answer: "4" },
  { id: 3, question: "HTML stands for?", options: ["HighText Machine Language", "HyperText Markup Language", "Hyperloop Machine Language", "None of the above"], answer: "HyperText Markup Language" },
  { id: 4, question: "CSS is used for?", options: ["Data storage", "Styling", "Scripting", "None"], answer: "Styling" },
  { id: 5, question: "Which language runs in the browser?", options: ["Python", "C", "Java", "JavaScript"], answer: "JavaScript" }
];

// Shuffle Utility
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Global Variables
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let answeredQuestions = new Array(questions.length).fill(false);
let userAnswers = new Array(questions.length).fill(null);
let bookmarkedQuestions = new Set();
let shuffledQuestions = [];

// DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const finishBtn = document.getElementById("finishBtn");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

// Start Quiz
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  timeLeft = 60;
  answeredQuestions.fill(false);
  userAnswers.fill(null);
  bookmarkedQuestions.clear();

  shuffledQuestions = shuffleArray(questions.map(q => ({
    ...q,
    options: shuffleArray([...q.options])
  })));

  showQuestion();
  updateBookmarkDisplay();
  updateBookmarkButtonState();
  timer = setInterval(updateTimer, 1000);
}

// Display Question
function showQuestion() {
  const q = shuffledQuestions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    if (userAnswers[currentQuestion] === option) btn.classList.add("selected");
    btn.onclick = () => selectAnswer(option);
    optionsEl.appendChild(btn);
  });

  const bookmarkBtn = document.createElement("button");
  bookmarkBtn.className = "bookmark-btn";
  bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
  if (bookmarkedQuestions.has(currentQuestion)) bookmarkBtn.classList.add("active");
  bookmarkBtn.onclick = () => toggleBookmark(currentQuestion);
  optionsEl.appendChild(bookmarkBtn);

  prevBtn.disabled = currentQuestion === 0;
  nextBtn.disabled = currentQuestion === questions.length - 1;

  handleFinishButtonDisplay();
  updateProgressBar();
  updateBookmarkButtonState();
}

// Select Answer
function selectAnswer(selected) {
  const qIndex = currentQuestion;
  const correct = shuffledQuestions[qIndex].answer;

  [...optionsEl.querySelectorAll("button")].forEach(btn => btn.classList.remove("selected"));
  const selectedBtn = [...optionsEl.querySelectorAll("button")].find(btn => btn.textContent === selected);
  if (selectedBtn) selectedBtn.classList.add("selected");

  if (!answeredQuestions[qIndex]) {
    answeredQuestions[qIndex] = true;
    if (selected === correct) score++;
    handleLastQuestionBookmark();
  } else {
    const previous = userAnswers[qIndex];
    if (previous !== correct && selected === correct) score++;
    else if (previous === correct && selected !== correct) score--;
  }

  userAnswers[qIndex] = selected;
  checkIfCanFinish();
  updateBookmarkButtonState();
}

// Toggle Bookmark
function toggleBookmark(index) {
  bookmarkedQuestions.has(index) ? bookmarkedQuestions.delete(index) : bookmarkedQuestions.add(index);
  updateBookmarkDisplay();
  showQuestion();
}

function updateBookmarkDisplay() {
  const count = document.querySelector('.bookmark-count');
  const content = document.querySelector('.bookmark-content');
  if (!count || !content) return;

  count.textContent = bookmarkedQuestions.size;
  content.innerHTML = '';

  if (bookmarkedQuestions.size === 0) {
    content.innerHTML = `<div class="empty-bookmarks"><i class="fas fa-bookmark"></i><p>No bookmarked questions</p></div>`;
    return;
  }

  bookmarkedQuestions.forEach(index => {
    const q = questions[index];
    const item = document.createElement('div');
    item.className = 'bookmark-item';
    item.innerHTML = `<div class="question-number">${index + 1}</div><i class="fas fa-bookmark"></i><div class="question-preview">${q.question}</div>`;
    item.addEventListener('click', () => {
      currentQuestion = index;
      showQuestion();
      document.getElementById('bookmark-list').classList.remove('open');
    });
    content.appendChild(item);
  });
}

// Navigation
nextBtn.onclick = () => { if (currentQuestion < questions.length - 1) currentQuestion++; showQuestion(); };
prevBtn.onclick = () => { if (currentQuestion > 0) currentQuestion--; showQuestion(); };
finishBtn.onclick = () => {
  const unanswered = answeredQuestions.filter(a => !a).length;
  if (unanswered > 0) confirm(`You have ${unanswered} unanswered questions. Finish exam?`) && endQuiz();
  else endQuiz();
};

// Timer
function updateTimer() {
  timeLeft--;
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    endQuiz();
  }
}

// End Quiz
function endQuiz() {
  answeredQuestions.forEach((answered, index) => { if (!answered) bookmarkedQuestions.add(index); });
  updateBookmarkDisplay();

  if (document.exitFullscreen) document.exitFullscreen();
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  else if (document.msExitFullscreen) document.msExitFullscreen();

  clearInterval(timer);
  localStorage.setItem("score", score);
  localStorage.setItem("totalQuestions", questions.length);
  window.location.replace("result.html");
}

// Helper Functions
function checkIfCanFinish() {
  finishBtn.disabled = !answeredQuestions.every(val => val);
}

function handleLastQuestionBookmark() {
  if (currentQuestion !== questions.length - 1) return;

  let added = false;
  answeredQuestions.forEach((a, i) => {
    if (!a) {
      bookmarkedQuestions.add(i);
      added = true;
    }
  });

  if (added) {
    updateBookmarkDisplay();
    updateBookmarkButtonState();
  }
  handleFinishButtonDisplay();
}

function handleFinishButtonDisplay() {
  const firstUnansweredIndex = answeredQuestions.findIndex(a => !a);
  const isLast = currentQuestion === questions.length - 1;
  if (isLast && answeredQuestions[currentQuestion]) {
    finishBtn.classList.add('pulse-animation');
    finishBtn.innerHTML = firstUnansweredIndex !== -1 ? `Finish (Question ${firstUnansweredIndex + 1} not answered)` : 'Finish';
    finishBtn.classList.toggle('has-unanswered', firstUnansweredIndex !== -1);
  } else {
    finishBtn.className = finishBtn.className.replace('pulse-animation', '').replace('has-unanswered', '').trim();
    finishBtn.innerHTML = 'Finish';
  }
}

function updateProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
}

function updateBookmarkButtonState() {
  const btn = document.getElementById('bookmarkToggle');
  const active = answeredQuestions.some(a => !a) && bookmarkedQuestions.size > 0;
  btn.classList.toggle('pulse-animation', active);
}

// Bookmark UI Events
document.getElementById('bookmarkToggle').onclick = () => {
  document.getElementById('bookmark-list').classList.toggle('open');
  document.getElementById('bookmarkToggle').classList.toggle('active');
};

document.getElementById('closeBookmark').onclick = () => {
  document.getElementById('bookmark-list').classList.remove('open');
  document.getElementById('bookmarkToggle').classList.remove('active');
};

document.getElementById('clearBookmarks').onclick = () => {
  bookmarkedQuestions.clear();
  updateBookmarkDisplay();
  showQuestion();
};

// Start Button
startBtn.onclick = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();

  startBtn.style.display = 'none';
  document.getElementById('bookmarkToggle').style.display = 'flex';
  startQuiz();
};

// Fullscreen Handling
document.addEventListener('keydown', e => {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (![].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}, true);

// function handleKeyPress(e) {
//   if (document.fullscreenElement || document.webkitFullscreenElement) {
//     if (e.key === 'Escape' || e.keyCode === 27) {
//       e.preventDefault();
//       e.stopPropagation();
//       if (confirm('هل أنت متأكد من الخروج من الامتحان؟')) endQuiz();
//     }
//   }
// }

function handleFullscreenChange() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    document.getElementById('confirmExitModal').style.display = 'flex';
  }
}

document.getElementById('confirmExitBtn').onclick = endQuiz;
document.getElementById('cancelExitBtn').onclick = () => {
  document.getElementById('confirmExitModal').style.display = 'none';
  const elem = document.documentElement;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
};

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
