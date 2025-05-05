const signinForm = document.getElementById("signin-form");
const signinMessage = document.getElementById("signin-message");

signinForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value;

  const storedUser = JSON.parse(localStorage.getItem("userData"));

  if (!storedUser) {
    signinMessage.style.color = "red";
    signinMessage.textContent = "No user found. Please sign up first.";
    return;
  }

  const encryptedInputPassword = CryptoJS.SHA256(passwordInput).toString();

  if (emailInput === storedUser.email && encryptedInputPassword === storedUser.password) {
    signinMessage.style.color = "green";
    signinMessage.textContent = "Login successful!";


    setTimeout(() => {
      // window.location.replace("examination.html");
      window.location.replace('examination.html');

    }, 1000);

  } else {
    signinMessage.style.color = "red";
    signinMessage.textContent = "Invalid email or password.";
  }
});
