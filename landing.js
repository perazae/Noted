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

  // Disables the button after the form has been submitted already:
  loginForm.loginButton.disabled = true;

  const spinner = document.getElementById("spinner");
  spinner.classList.remove("d-none");

  // Time to actually process the login using the function from auth.js!
  await login(loginData).then((response) => {
    if (response.statusCode === 400) {
      alert("invalid credentials");
    }
  });

  // Re-enable the button after the fetch request has been completed:
  loginForm.loginButton.disabled = false;
  spinner.classList.remove("d-none");
};
