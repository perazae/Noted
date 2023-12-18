"use strict";

window.onload = init;

let userData;

async function init() {
  userData = getLoggedInUser();
}

// returns an object of a user
// with properties: username, bio, fullName, createdAt, updatedAt
async function getLoggedInUser() {

  const loginData = getLoginData();

    document.getElementById('viewUser').innerHTML = `${loginData.username}</h1>`
}


