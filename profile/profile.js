'use strict';



let token = getLoginData();
    


// Retrieve data from local storage
var retrievedValue = localStorage.getItem('login-data');
retrievedValue = JSON.parse(retrievedValue)

let userNameEndpoint = retrievedValue.username;

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjMiLCJpYXQiOjE3MDI1MTA3NjksImV4cCI6MTcwMjU5NzE2OX0.AYsMSYEadpMT1hQCAlydG2w-EsAjJZTJiHHD75K_XzQ");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`https://microbloglite.onrender.com/api/users/${userNameEndpoint}`)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));






  
