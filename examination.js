const questions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "London"],
    answer: "Paris"
  },
  {
    id: 2,
    question: "2 + 2 equals?",
    options: ["3", "4", "5", "2"],
    answer: "4"
  },
  {
    id: 3,
    question: "HTML stands for?",
    options: [
      "HighText Machine Language",
      "HyperText Markup Language",
      "Hyperloop Machine Language",
      "None of the above"
    ],
    answer: "HyperText Markup Language"
  },
  {
    id: 4,
    question: "CSS is used for?",
    options: ["Data storage", "Styling", "Scripting", "None"],
    answer: "Styling"
  },
  {
    id: 5,
    question: "Which language runs in the browser?",
    options: ["Python", "C", "Java", "JavaScript"],
    answer: "JavaScript"
  }
];


let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let bookmarks = [];
let answeredQuestions = new Array(questions.length).fill(false);
let userAnswers = new Array(questions.length).fill(null);


const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const finishBtn = document.getElementById("finishBtn");
const resultBox = document.getElementById("result-box");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const bookmarkList = document.getElementById("bookmark-list");
/********************************************* */

function startQuiz() {
  shuffle(questions); 
  showQuestion();
  timer = setInterval(updateTimer, 1000);
}

/********************************************* */

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  questionEl.classList.add("fade-in");

  const bookmarkBtn = document.createElement("button");
  bookmarkBtn.textContent = "🔖 Bookmark";
  bookmarkBtn.onclick = () => addBookmark(currentQuestion);
  optionsEl.appendChild(bookmarkBtn);

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;

    if (userAnswers[currentQuestion] === option) {
      btn.classList.add("selected");
    }

    btn.onclick = () => selectAnswer(option);
    optionsEl.appendChild(btn);
  });

  updateBookmarkList();
  nextBtn.disabled = false;
}


/********************************************* */

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}



/********************************************* */


function addBookmark(index) {
  const questionId = questions[index].id;
  if (!bookmarks.includes(questionId)) {
    bookmarks.push(questionId);
    updateBookmarkList();
  }
}

/********************************************* */

function updateBookmarkList() {
  bookmarkList.innerHTML = "<h3>Bookmarked Questions:</h3>";

  bookmarks.forEach(id => {
    const index = questions.findIndex(q => q.id === id);
    const btn = document.createElement("button");
    btn.textContent = `Go to Q${index + 1}`;
    btn.onclick = () => {
      currentQuestion = index;
      showQuestion();
    };
    bookmarkList.appendChild(btn);
  });
}

/********************************************* */

function selectAnswer(selected) {
  const qIndex = currentQuestion;
  const correctAnswer = questions[qIndex].answer;

  const allOptionButtons = Array.from(optionsEl.querySelectorAll("button")).slice(1);
  allOptionButtons.forEach(btn => btn.classList.remove("selected"));

  const selectedBtn = allOptionButtons.find(btn => btn.textContent === selected);
  if (selectedBtn) selectedBtn.classList.add("selected");

  if (!answeredQuestions[qIndex]) {
    answeredQuestions[qIndex] = true;
    if (selected === correctAnswer) {
      score++;
    }
  } else {
    const previousAnswer = userAnswers[qIndex];
    if (previousAnswer !== correctAnswer && selected === correctAnswer) {
      score++;
    } else if (previousAnswer === correctAnswer && selected !== correctAnswer) {
      score--;
    }
  }

  userAnswers[qIndex] = selected;
  nextBtn.disabled = false;
  checkIfCanFinish();
}


/********************************************* */
function reviewAnswers() {
  const unansweredQuestions = questions.filter((q, index) => !answeredQuestions[index]);
  if (unansweredQuestions.length > 0) {
    alert(`You have unanswered questions: ${unansweredQuestions.map(q => q.id).join(", ")}`);
  } else {
    alert("You have answered all questions!");
  }
}

finishBtn.addEventListener("click", () => {
  reviewAnswers();
  endQuiz();
});

/********************************************* */


function checkIfCanFinish() {
  const allAnswered = answeredQuestions.every(val => val === true);
  if (allAnswered) {
    finishBtn.disabled = false;
  }
}
/********************************************* */

function updateTimer() {
  timeLeft--;
  timerEl.textContent = `Time Left: ${timeLeft}s`;

  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${(timeLeft / 60) * 100}%`;

  if (timeLeft <= 0) {
    clearInterval(timer);
    endQuiz();
  }
}

/********************************************* */
function endQuiz() {
  clearInterval(timer);
  timeLeft = 0;
  timerEl.textContent = `Time Left: 0s`;

  document.getElementById("quiz-box").classList.add("hidden");
  resultBox.classList.remove("hidden");

  const percentage = ((score / questions.length) * 100).toFixed(2);
  scoreEl.textContent = `You scored ${percentage}% (${score} out of ${questions.length})`;
}

/**************************************** */
nextBtn.addEventListener("click", () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    alert("No more questions. You can finish if all answered or wait for time.");
  }
});
/************************************* */
prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
});
/**************************************************** */

finishBtn.addEventListener("click", () => {
  endQuiz();
});

startQuiz();
/************************************************************** */
// Disable browser back button
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.pushState(null, null, location.href);
  // alert("Back navigation is disabled during the exam.");
};
