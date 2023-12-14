'use strict';

const loginData = getLoginData();

const loginToken = loginData.token;

const usernameEndpoint = loginData.username;

const stringValue = JSON.stringify(usernameEndpoint)



//   GET /auth/logout
  const options = {
    method: "GET",
    headers: {
      // This header is how we authenticate our user with the
      // server for any API requests which require the user
      // to be logged-in in order to have access.
      // In the API docs, these endpoints display a lock icon.
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjMiLCJpYXQiOjE3MDI1MTA3NjksImV4cCI6MTcwMjU5NzE2OX0.AYsMSYEadpMT1hQCAlydG2w-EsAjJZTJiHHD75K_XzQ`,
    },
  };

fetch(`https://microbloglite.onrender.com/api/users/${usernameEndpoint}`)
  .then(response => response.json())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));






  
