const score = localStorage.getItem("score");
const total = localStorage.getItem("totalQuestions");

if (score !== null && total !== null) {
  const percentage = ((score / total) * 100).toFixed(2);
  document.getElementById("score").textContent =
    `You scored ${percentage}% (${score} out of ${total})`;
} else {
  document.getElementById("score").textContent = "No result found.";
}

function goBack() {
  localStorage.clear();
  window.location.replace("/examination.html");
}
