/* Landing Page JavaScript */

"use strict";

const signupForm = document.querySelector("#signup");

signupForm.onsubmit = async function (event) {
  // Prevent the form from refreshing the page,
  // as it will do by default when the Submit event is triggered:
  event.preventDefault();

  const fullName = signupForm.fullName.value;
  const username = signupForm.username.value;
  const password = signupForm.password.value;

  // We can use signupForm.username (for example) to access
  // the input element in the form which has the ID of "username".
  const userData = {
    fullName,
    username,
    password,
  };

  // Disables the button after the form has been submitted already:
  signupForm.signupButton.disabled = true;

  // create the user first
  const spinner = document.getElementById("spinner");
  spinner.classList.remove("d-none");

  const response = await createUser(userData);
  if (!response.ok) {
    alert("username has already been taken");
    spinner.classList.add("d-none");
    // Re-enable the button after the fetch request has been completed:
    signupForm.signupButton.disabled = false;
    return;
  }
  // Time to actually process the login using the function from auth.js!
  login({ username, password });
};
