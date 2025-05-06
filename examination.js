/********* Prevent Back Navigation **********/
window.history.forward();
setTimeout(() => window.history.forward(), 0);
window.onunload = () => null;
history.pushState(null, null, location.href);
window.onpopstate = () => history.pushState(null, null, location.href);

/********* Questions **********/
const questions = [
  { id: 1, question: "What is the capital of France?", options: ["Madrid", "Berlin", "Paris", "London"], answer: "Paris" },
  { id: 2, question: "2 + 2 equals?", options: ["3", "4", "5", "2"], answer: "4" },
  { id: 3, question: "HTML stands for?", options: ["HighText Machine Language", "HyperText Markup Language", "Hyperloop Machine Language", "None of the above"], answer: "HyperText Markup Language" },
  { id: 4, question: "CSS is used for?", options: ["Data storage", "Styling", "Scripting", "None"], answer: "Styling" },
  { id: 5, question: "Which language runs in the browser?", options: ["Python", "C", "Java", "JavaScript"], answer: "JavaScript" }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let answeredQuestions = new Array(questions.length).fill(false);
let userAnswers = new Array(questions.length).fill(null);
let bookmarkedQuestions = new Set();

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const finishBtn = document.getElementById("finishBtn");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

/********** Start Quiz **********/
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  timeLeft = 60;
  answeredQuestions.fill(false);
  userAnswers.fill(null);
  bookmarkedQuestions.clear();

  showQuestion();
  updateBookmarkDisplay();
  timer = setInterval(updateTimer, 1000);
}

/********** Show Question **********/
function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    if (userAnswers[currentQuestion] === option) {
      btn.classList.add("selected");
    }
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

  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  }
}

/********** Select Answer **********/
function selectAnswer(selected) {
  const qIndex = currentQuestion;
  const correct = questions[qIndex].answer;

  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => btn.classList.remove("selected"));

  const selectedBtn = Array.from(buttons).find(btn => btn.textContent === selected);
  if (selectedBtn) selectedBtn.classList.add("selected");

  if (!answeredQuestions[qIndex]) {
    answeredQuestions[qIndex] = true;
    if (selected === correct) score++;
  } else {
    const previous = userAnswers[qIndex];
    if (previous !== correct && selected === correct) score++;
    else if (previous === correct && selected !== correct) score--;
  }

  userAnswers[qIndex] = selected;
  checkIfCanFinish();
}

/********** Bookmark **********/
function toggleBookmark(index) {
  if (bookmarkedQuestions.has(index)) {
    bookmarkedQuestions.delete(index);
  } else {
    bookmarkedQuestions.add(index);
  }
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
    content.innerHTML = `<div class="empty-bookmarks"><i class="fas fa-bookmark"></i><p>لا توجد أسئلة محفوظة</p></div>`;
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

/********** Navigation **********/
nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
});

finishBtn.addEventListener("click", () => {
  const unanswered = answeredQuestions.filter(a => !a).length;
  if (unanswered > 0) {
    if (confirm(`لديك ${unanswered} أسئلة لم تتم الإجابة عليها. هل تريد إنهاء الامتحان؟`)) {
      endQuiz();
    }
  } else {
    endQuiz();
  }
});

/********** Timer **********/
function updateTimer() {
  timeLeft--;
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    endQuiz();
  }
}

/********** Finish Quiz **********/
function endQuiz() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
  
  clearInterval(timer);
  localStorage.setItem("score", score);
  localStorage.setItem("totalQuestions", questions.length);
 
  // Redirect to result page
  // window.location.href = "result.html";
  window.location.replace("result.html")
}

/********** Check Finish State **********/
function checkIfCanFinish() {
  finishBtn.disabled = !answeredQuestions.every(val => val === true);
}

/********** Bookmark Toggle Events **********/
document.getElementById('bookmarkToggle').addEventListener('click', () => {
  document.getElementById('bookmark-list').classList.toggle('open');
  document.getElementById('bookmarkToggle').classList.toggle('active');
});

document.getElementById('closeBookmark').addEventListener('click', () => {
  document.getElementById('bookmark-list').classList.remove('open');
  document.getElementById('bookmarkToggle').classList.remove('active');
});

document.getElementById('clearBookmarks').addEventListener('click', () => {
  if (confirm('هل أنت متأكد من مسح جميع الإشارات المرجعية؟')) {
    bookmarkedQuestions.clear();
    updateBookmarkDisplay();
    showQuestion();
  }
});

/********** Start Button **********/
startBtn.addEventListener('click', () => {
  // Request fullscreen
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
  
  startBtn.style.display = 'none';
  startQuiz();
});
