"use strict";

window.onload = init;

let userData;

async function init() {
 userData = getLoggedInUser();
 viewProfilePosts();
 viewUserInfo()
}

// returns an object of a user
// with properties: Token and Username
async function getLoggedInUser() {

  const loginData = getLoginData();


  document.getElementById('viewUser').innerHTML = 
  `
  @${loginData.username}</h1>
  `;
}

function viewProfilePosts(){
var myHeaders = new Headers();

const loginData = getLoginData();
const userToken = loginData.token;
myHeaders.append("Authorization", `Bearer ${userToken}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts?username=${loginData.username}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    let postNums = result.length

    //Displaying number of posts on profile
    document.getElementById('postNumber').innerHTML = postNums;
    let posts = "";
    let likes = "";

    //for loop post iteration
    for (let index = 0; index < result.length; index++) {
      const element = result[index];


      if (likes = true){
        likes += 1
      }

      //Formatting time of post 
      const timeStamp = element.createdAt
      const date = new Date(timeStamp);

      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      };
      
      //Newly formatted time of post to display
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

      const userPost = 
      `
      <div class="card m-3 col-12 shadow p-3 mb-5 bg-white rounded" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">@${element.username}</h6>
        <div class="shadow-sm p-3 mb-5 bg-white rounded border-top">
        <p class="card-text"><h4 class="text-center"><strong>${element.text}</strong></h4></p>
        <h6 class="card-subtitle mb-2 text-body-secondary text-center"><em>Noted: ${formattedDate}</em></h6>
        </div>
        <div class="text-center">
        <a href="#" class="card-link">Like</a>
        <a href="#" class="card-link">Comment</a>
        </div>
      </div>
    </div>
      `
      posts += userPost 
    }
    document.getElementById('userPosts').innerHTML += posts
    document.getElementById('postLikes').innerHTML += likes
  })
  .catch(error => console.log('error', error));
}

//View user info with properties: fullname, un, bio, created and updated
function viewUserInfo(){
  var myHeaders = new Headers();
  const loginData = getLoginData();

  const userName = loginData.username

  const userToken = loginData.token;

  myHeaders.append("Authorization", `Bearer ${userToken}`);

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch(`https://microbloglite.onrender.com/api/users/${userName}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    editProfile(result)
    document.getElementById('userFullName').innerHTML = `<strong>${result.fullName}</strong>`
    document.getElementById('userBio').innerHTML = `${result.bio}`
  })
  .catch(error => console.log('error', error));
}

function editProfile(result){
  document.getElementById('editFullName').innerHTML = result.fullName
  document.getElementById('editBio').innerHTML = result.bio
}


function putRequestProfile(){
var myHeaders = new Headers();

const loginData = getLoginData();

const userName = loginData.username;

const userToken = loginData.token;

const fullNameValue = document.getElementById('editFullName').value; 

const bioValue = document.getElementById('editBio').value; 

myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", `Bearer ${userToken}`);

var raw = JSON.stringify({
  //Grab values from edit profile values: fullname and bio
  "bio": `${bioValue}`,
  "fullName": `${fullNameValue}`
});

var requestOptions = {
  method: 'PUT',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch(`https://microbloglite.onrender.com/api/users/${userName}`, requestOptions)
  .then(response => response.json())
  .then(result => {
    location.reload();
  })
  .catch(error => console.log('error', error));
}

