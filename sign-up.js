const form = document.getElementById("signup-form");
const errorMessage = document.getElementById("error-message");

// Validation Functions 
function validateEmail(email) {
  const re = /^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/i;
  return re.test(String(email).toLowerCase());
}

function isOnlyLetters(str) {
  return /^[A-Za-z]+$/.test(str);
}

function showError(inputId, message) {
  const errorSpan = document.getElementById(`${inputId}-error`);
  errorSpan.style.color = "red";
  errorSpan.textContent = message;
}

function clearError(inputId) {
  const errorSpan = document.getElementById(`${inputId}-error`);
  errorSpan.textContent = "";
}

function validateField(inputId) {
  const value = document.getElementById(inputId).value.trim();

  if (inputId === "firstName" || inputId === "lastName") {
    if (!value) {
      showError(inputId, `${inputId === "firstName" ? "First" : "Last"} name is required`);
    } else if (!isOnlyLetters(value)) {
      showError(inputId, `${inputId === "firstName" ? "First" : "Last"} name must contain only letters`);
    } else {
      clearError(inputId);
    }
  }

  if (inputId === "email") {
    if (!value) {
      showError("email", "Email is required");
    } else if (!validateEmail(value)) {
      showError("email", "Email must be a valid domain (gmail, yahoo, etc.)");
    } else {
      clearError("email");
    }
  }

  if (inputId === "password") {
    if (!value) {
      showError("password", "Password is required");
    } else if (value.length < 6 || value.length > 10) {
      showError("password", "Password must be between 6 and 10 characters");
    } else {
      clearError("password");
    }

    // Re-check confirmPassword as well
    validateField("confirmPassword");
  }

  if (inputId === "confirmPassword") {
    const password = document.getElementById("password").value;
    if (!value) {
      showError("confirmPassword", "Confirmation password is required");
    } else if (value !== password) {
      showError("confirmPassword", "Passwords do not match");
    } else {
      clearError("confirmPassword");
    }
  }
}

//  Live Validation Setup
["firstName", "lastName", "email", "password", "confirmPassword"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => validateField(id));
});

//  Submit Handler 
form.addEventListener("submit", (event) => {
  event.preventDefault();

  let hasError = false;

  ["firstName", "lastName", "email", "password", "confirmPassword"].forEach((id) => {
    validateField(id);
    const errorText = document.getElementById(`${id}-error`).textContent;
    if (errorText) hasError = true;
  });

  if (hasError) return;

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const encryptedPassword = CryptoJS.SHA256(password).toString();

  const userData = {
    firstName,
    lastName,
    email,
    password: encryptedPassword,
  };

  // Store multiple users in an array
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));

  errorMessage.style.color = "green";
  errorMessage.textContent = "Form is submitted";
  form.reset();
  console.log(users);

  setTimeout(() => {
    window.location.href = "signin.html";
  }, 1000);
});