const form = document.getElementById("signup-form");
const errorMessage = document.getElementById("error-message");

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function isOnlyLetters(str) {
  const re = /^[A-Za-z]+$/;
  return re.test(str); //check if the string recieved achieved the regular expression
}

form.addEventListener("submit", (event) => {
  event.preventDefault(); //preventing form from submitting data if validation is not achieved

  const firstName = document.getElementById("firstName").value.trim(); //trim to remove spaces
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    //check if one or more of the fields is not filled
    errorMessage.style.color = "red";
    errorMessage.textContent = "please fill all the fields in the form";
    return;
  }

  if (!isOnlyLetters(firstName)) {
    errorMessage.style.color = "red";
    errorMessage.textContent = "your name must be only letters";
    return;
  }

  if (!isOnlyLetters(lastName)) {
    errorMessage.style.color = "red";
    errorMessage.textContent = "your name must be only letters";
    return;
  }

  if (!validateEmail) {
    errorMessage.style.color = "red";
    errorMessage.textContent = "please enter a valid E-mail";
    return;
  }

  if (password.length > 10) {
    errorMessage.style.color = "red";
    errorMessage.textContent = "your password must be less than 10 charachters";
    return;
  }

  if (confirmPassword !== password) {
    errorMessage.style.color = "red";
    errorMessage.textContent = "Confirmation dosen't match pasword";
    return;
  }

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
    window.location.href = "signin.html"; // Redirect to sign-in page
  }, 1000);                               // Wait 1 second to show the success message
}); 