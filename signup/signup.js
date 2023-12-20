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

  if (!fullName.trim() || !username.trim() || !password.trim()) return;

  // We can use signupForm.username (for example) to access
  // the input element in the form which has the ID of "username".
  const userData = {
    fullName,
    username,
    password,
  };

  // Disables the button after the form has been submitted already:
  signupForm.signupButton.disabled = true;

  signupForm.signupButton.innerHTML = `
    <div class="spinner-border text-white" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>`;

  const response = await createUser(userData);
  if (!response.ok) {
    alert("Username has already been taken.");
    // Re-enable the button after the fetch request has been completed:
    signupForm.signupButton.disabled = false;
    signupForm.signupButton.textContent = "Sign Up";
    return;
  } else {
    // Time to actually process the login using the function from auth.js!
    await login({ username, password });
  }
};
