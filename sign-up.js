const form = document.getElementById("signup-form");
const errorMessage = document.getElementById("error-message");

function validateEmail(email) {
  const re = /^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com)$/i;
  return re.test(String(email).toLowerCase());
}

function isOnlyLetters(str) {
  const re = /^[A-Za-z]+$/;
  return re.test(str); //check if the string recieved achieved the regular expression
}

function showError(inputId, message) {
  const errorSpan = document.getElementById(`${inputId}-error`); //concatination of span id ,changes from input to other
  errorSpan.style.color = "red";
  errorSpan.textContent = message;
}

function clearError(inputId) {
  const errorSpan = document.getElementById(`${inputId}-error`);
  errorSpan.textContent = "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); //preventing form from submitting data if validation is not achieved

  let hasError = false;

  const firstName = document.getElementById("firstName").value.trim(); //trim to remove spaces
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!firstName) {
    showError("firstName", "First name is required");
    hasError = true;
  } else if (!isOnlyLetters(firstName)) {
    showError("firstName", "First name must contain only letters");
    hasError = true;
  } else {
    clearError("firstName");
  }

  if (!lastName) {
    showError("lastName", "Last name is required");
    hasError = true;
  } else if (!isOnlyLetters(lastName)) {
    showError("lastName", "Last name must contain only letters");
    hasError = true;
  } else {
    clearError("lastName");
  }

  if (!email) {
    showError("email", "Email is required");
    hasError = true;
  } else if (!validateEmail(email)) {
    showError("email", "Email must be a valid domain (gmail, yahoo, ...)");
    hasError = true;
  } else {
    clearError("email");
  }

  if (!password) {
    showError("password", "Password is required");
    hasError = true;
  } else if (password.length<6 || password.length > 10) {
    showError("password", "Password must be more than 6 and less than 10 characters");
    hasError = true;
  } else {
    clearError("password");
  }

  if (!confirmPassword) {
    showError("confirmPassword", "Confirmation password is required");
    hasError = true;
  } else if (confirmPassword !== password) {
    showError("confirmPassword", "Passwords do not match");
    hasError = true;
  } else {
    clearError("confirmPassword");
  }

  if (hasError) return;

  const encryptedPassword = CryptoJS.SHA256(password).toString(); //to encrypt password

  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: encryptedPassword,
  };

  localStorage.setItem("userData", JSON.stringify(userData)); //json.stringify :converting object to string so local storage can use it

  errorMessage.style.color = "green";
  errorMessage.textContent = "Form is submited";
  form.reset();

  const savedData = JSON.parse(localStorage.getItem("userData"));
  console.log(savedData);

  setTimeout(() => {
    // window.location.replace('signin.html');


    window.location.href = "signin.html"; // Redirect to sign-in page
  }, 1000);                               // Wait 1 second to show the success message
}); 