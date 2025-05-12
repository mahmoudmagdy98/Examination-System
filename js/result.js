 // Get data from localStorage
 const score = parseInt(localStorage.getItem('score')) || 0;
 const totalQuestions = parseInt(localStorage.getItem('totalQuestions')) || 0;
 const timeTaken = parseInt(localStorage.getItem('timeTaken')) || 0;

 // Calculate percentage and correct answers
 const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
 const correctAnswers = score;

 // Calculate clip path based on percentage
 const calculateClipPath = (percent) => {
     const angle = (percent / 100) * 360;
     const radians = (angle - 90) * (Math.PI / 180);
     const x = 50 + 50 * Math.cos(radians);
     const y = 50 + 50 * Math.sin(radians);
     
     if (percent <= 25) {
         return `polygon(50% 50%, 50% 0%, ${x}% ${y}%, 50% 50%)`;
     } else if (percent <= 50) {
         return `polygon(50% 50%, 50% 0%, 0% 0%, 0% ${y}%, 50% 50%)`;
     } else if (percent <= 75) {
         return `polygon(50% 50%, 50% 0%, 0% 0%, 0% 100%, ${x}% 100%, 50% 50%)`;
     } else {
         return `polygon(50% 50%, 50% 0%, 0% 0%, 0% 100%, 100% 100%, 100% ${y}%, 50% 50%)`;
     }
 };

 // Animate the circle progress
 const animateCircle = () => {
     let currentPercent = 0;
     const duration = 2000; // 2 seconds
     const interval = 50; // Update every 50ms
     const steps = duration / interval;
     const increment = percentage / steps;

     const updateCircle = () => {
         currentPercent += increment;
         if (currentPercent >= percentage) {
             currentPercent = percentage;
             document.documentElement.style.setProperty('--progress-clip', calculateClipPath(currentPercent));
             return;
         }
         document.documentElement.style.setProperty('--progress-clip', calculateClipPath(currentPercent));
         setTimeout(updateCircle, interval);
     };

     updateCircle();
 };

 // Set initial clip path
 document.documentElement.style.setProperty('--progress-clip', calculateClipPath(0));

 // Format time taken
 const formatTime = (seconds) => {
     if (seconds < 60) {
         return `${seconds}s`;
     } else {
         const minutes = Math.floor(seconds / 60);
         const remainingSeconds = seconds % 60;
         return `${minutes}m ${remainingSeconds}s`;
     }
 };

 // Update the DOM with results
 const scoreElement = document.getElementById('score');
 const scoreCircle = document.querySelector('.score-circle');

 // Animate score
 let currentScore = 0;
 const duration = 2000; // 2 seconds
 const interval = 50; // Update every 50ms
 const steps = duration / interval;
 const increment = percentage / steps;

 const animateScore = () => {
     currentScore += increment;
     if (currentScore >= percentage) {
         currentScore = percentage;
         scoreElement.textContent = `${Math.round(currentScore)}%`;
         scoreElement.classList.add('loaded');
         return;
     }
     scoreElement.textContent = `${Math.round(currentScore)}%`;
     setTimeout(animateScore, interval);
 };

 // Start animations after a short delay
 setTimeout(() => {
     animateScore();
     animateCircle();
 }, 500);

 // Update other stats
 document.getElementById('correctAnswers').textContent = correctAnswers;
 document.getElementById('totalQuestions').textContent = totalQuestions;
 document.getElementById('timeTaken').textContent = formatTime(timeTaken);
 document.getElementById('accuracy').textContent = `${percentage}%`;

 // Clear localStorage when leaving the page
 window.addEventListener('beforeunload', () => {
     localStorage.removeItem('score');
     localStorage.removeItem('totalQuestions');
     localStorage.removeItem('timeTaken');
 });


 /*******************************************/
//         function goBack() {
//   localStorage.clear();
//   window.location.replace("/examination.html");
// }