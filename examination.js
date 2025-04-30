const questions = [
  {
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "London"],
    answer: "Paris"
  },
  {
    question: "2 + 2 equals?",
    options: ["3", "4", "5", "2"],
    answer: "4"
  },
  {
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
    question: "CSS is used for?",
    options: ["Data storage", "Styling", "Scripting", "None"],
    answer: "Styling"
  },
  {
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
  showQuestion();
  timer = setInterval(updateTimer, 1000);
}
/********************************************* */

function showQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

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
  nextBtn.disabled = !answeredQuestions[currentQuestion];
}

/********************************************* */

function addBookmark(index) {
  if (!bookmarks.includes(index)) {
    bookmarks.push(index);
    updateBookmarkList();
  }
}
/********************************************* */

function updateBookmarkList() {
  bookmarkList.innerHTML = "<h3>Bookmarked Questions:</h3>";

  bookmarks.forEach(index => {
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
  scoreEl.textContent = `You scored ${score} out of ${questions.length}`;
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
