/* Landing Page JavaScript */

"use strict";

const loginForm = document.querySelector("#login");

loginForm.onsubmit = async function (event) {
  // Prevent the form from refreshing the page,
  // as it will do by default when the Submit event is triggered:
  event.preventDefault();

  // We can use loginForm.username (for example) to access
  // the input element in the form which has the ID of "username".
  const loginData = {
    username: loginForm.username.value,
    password: loginForm.password.value,
  };

  if (!loginData.username.trim() || !loginData.password.trim()) return;

  // Disables the button after the form has been submitted already:
  loginForm.loginButton.disabled = true;

  // Show spinner before processing the login
  loginForm.loginButton.innerHTML = `
    <div class="spinner-border text-white" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;

  // Time to actually process the login using the function from auth.js!
  await login(loginData).then((response) => {
    if (response.statusCode === 400) {
      alert("Invalid credentials. Please try again.");
    }
  });

  // Re-enable the button after the fetch request has been completed:
  loginForm.loginButton.disabled = false;
  loginForm.textContent = "Login"
};
