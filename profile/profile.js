"use strict";

window.onload = init;

let userData;
async function init() {
  userData = await getUser();
}

// returns an object of a user
// with properties: username, bio, fullName, createdAt, updatedAt
async function getUser() {
  const loginData = getLoginData();

  // GET /api/users/:username
  const options = {
    method: "GET",
    headers: {
      // This header is how we authenticate our user with the
      // server for any API requests which require the user
      // to be logged-in in order to have access.
      // In the API docs, these endpoints display a lock icon.
      Authorization: `Bearer ${loginData.token}`,
    },
  };

  fetch(apiBaseURL + `/api/users/${loginData.username}`, options)
    .then((response) => response.json())
    .then((data) => console.log(data))
}
