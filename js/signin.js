const form = document.getElementById("signin-form");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    errorMessage.style.color = "red";
    errorMessage.textContent = "Email and password are required.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const encryptedPassword = CryptoJS.SHA256(password).toString();

  const matchedUser = users.find(
    (user) => user.email === email && user.password === encryptedPassword
  );

  if (matchedUser) {
    errorMessage.style.color = "green";
    errorMessage.textContent = "Login successful!";
    
    setTimeout(() => {
      
      window.location.replace("examination.html");
    }, 1000);
  } else {
    errorMessage.style.color = "red";
    errorMessage.textContent = "Invalid email or password.";
  }
});