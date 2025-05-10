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

// Function to shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let answeredQuestions = new Array(questions.length).fill(false);
let userAnswers = new Array(questions.length).fill(null);
let bookmarkedQuestions = new Set();
let shuffledQuestions = [];

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
  
  // Shuffle questions and their options
  shuffledQuestions = questions.map(q => ({
    ...q,
    options: shuffleArray([...q.options])
  }));
  shuffledQuestions = shuffleArray([...shuffledQuestions]);

  showQuestion();
  updateBookmarkDisplay();
  updateBookmarkButtonState();
  timer = setInterval(updateTimer, 1000);
}

/********** Show Question **********/
function showQuestion() {
  const q = shuffledQuestions[currentQuestion];
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

  // Only show unanswered warning when last question is answered
  if (currentQuestion === questions.length - 1 && answeredQuestions[currentQuestion]) {
    finishBtn.classList.add('pulse-animation');
    const firstUnansweredIndex = answeredQuestions.findIndex(a => !a);
    if (firstUnansweredIndex !== -1) {
      finishBtn.innerHTML = `Finish (Question ${firstUnansweredIndex + 1} not answered)`;
      finishBtn.classList.add('has-unanswered');
    } else {
      finishBtn.innerHTML = 'Finish';
      finishBtn.classList.remove('has-unanswered');
    }
  } else {
    finishBtn.classList.remove('pulse-animation');
    finishBtn.innerHTML = 'Finish';
    finishBtn.classList.remove('has-unanswered');
  }

  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  }

  updateBookmarkButtonState();
}

/********** Select Answer **********/
function selectAnswer(selected) {
  const qIndex = currentQuestion;
  const correct = shuffledQuestions[qIndex].answer;

  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach(btn => btn.classList.remove("selected"));

  const selectedBtn = Array.from(buttons).find(btn => btn.textContent === selected);
  if (selectedBtn) selectedBtn.classList.add("selected");

  if (!answeredQuestions[qIndex]) {
    answeredQuestions[qIndex] = true;
    if (selected === correct) score++;
    
    // Only add unanswered questions to bookmarks when answering the last question
    if (currentQuestion === questions.length - 1) {
      let addedQuestions = false;
      // Add all unanswered questions to bookmarks
      answeredQuestions.forEach((answered, index) => {
        if (!answered) {
          bookmarkedQuestions.add(index);
          addedQuestions = true;
        }
      });
      
      // Only show animation if questions were actually added
      if (addedQuestions) {
        updateBookmarkDisplay();
        updateBookmarkButtonState();
      }

      // Update finish button immediately
      finishBtn.classList.add('pulse-animation');
      const firstUnansweredIndex = answeredQuestions.findIndex(a => !a);
      if (firstUnansweredIndex !== -1) {
        finishBtn.innerHTML = `Finish (Question ${firstUnansweredIndex + 1} not answered)`;
        finishBtn.classList.add('has-unanswered');
      } else {
        finishBtn.innerHTML = 'Finish';
        finishBtn.classList.remove('has-unanswered');
      }
    }
  } else {
    const previous = userAnswers[qIndex];
    if (previous !== correct && selected === correct) score++;
    else if (previous === correct && selected !== correct) score--;
  }

  userAnswers[qIndex] = selected;
  checkIfCanFinish();
  updateBookmarkButtonState();
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
    if (confirm(`You have ${unanswered} unanswered questions. Do you want to finish the exam?`)) {
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
  // Bookmark unanswered questions
  answeredQuestions.forEach((answered, index) => {
    if (!answered) {
      bookmarkedQuestions.add(index);
    }
  });
  updateBookmarkDisplay();

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
  window.location.replace("result.html");
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
  bookmarkedQuestions.clear();
  updateBookmarkDisplay();
  showQuestion();
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
  
  // Add keyboard event listeners to window
//   window.addEventListener('keydown', handleKeyPress, true);

  
  startBtn.style.display = 'none';
  document.getElementById('bookmarkToggle').style.display = 'flex'; // Show bookmark button
  startQuiz();
});

/************************ */




document.addEventListener('keydown', function (e) {
  if (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  ) {
    const allowedKeys = []; 

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }
}, true);

/************************** */
// Function to handle key press
function handleKeyPress(e) {
  // Only handle keys if in fullscreen
  if (document.fullscreenElement || 
      document.webkitFullscreenElement || 
      document.mozFullScreenElement ||
      document.msFullscreenElement) {
    
    // Show confirmation dialog for ESC key
    if (e.key === 'Escape' || e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation();
      
      // Show native confirm dialog
      if (confirm('هل أنت متأكد من الخروج من الامتحان؟')) {
        endQuiz();
      }
      
      return false;
    }
  }
}

// Remove keyboard event listeners when exiting fullscreen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.mozFullScreenElement &&
    !document.msFullscreenElement
  ) {
    // عرض النافذة بدل endQuiz مباشرة
    document.getElementById('confirmExitModal').style.display = 'flex';
  }
}

document.getElementById('confirmExitBtn').addEventListener('click', () => {
  endQuiz();
});

document.getElementById('cancelExitBtn').addEventListener('click', () => {
  document.getElementById('confirmExitModal').style.display = 'none';

  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  }
});

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);


// Add new function to update bookmark button state
function updateBookmarkButtonState() {
  const bookmarkToggle = document.getElementById('bookmarkToggle');
  const hasUnanswered = answeredQuestions.some(a => !a);
  const hasBookmarks = bookmarkedQuestions.size > 0;
  
  if (hasUnanswered && hasBookmarks) {
    bookmarkToggle.classList.add('pulse-animation');
  } else {
    bookmarkToggle.classList.remove('pulse-animation');
  }
}
