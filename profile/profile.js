"use strict";

window.onload = init;

async function init() {
  const urlParams = new URLSearchParams(location.search);
  let currentUser = getLoginData().username;
  let username = "";
  let userInfo;

  // check if we're visiting someone else's profile
  if (urlParams.has("username") === true) {
    username = urlParams.get("username");
  } else {
    username = currentUser;
  }

  // check if the user exists from the given username in the URL params
  const response = await getUserInfo(username);
  if (response.ok) {
    userInfo = await response.json();
    prepopulateEditProfileForm(userInfo);
    updateProfile(userInfo);
  } else {
    // if the response is not OK, then the given username doesn't exist
    // redirect to the current user's profile page
    window.location.href = "/profile";
  }

  // Event listener for submitting the Edit Profile form
  const btnSubmitEditProfile = document.getElementById("btnSubmitEditProfile");
  btnSubmitEditProfile.addEventListener("click", (event) => {
    event.preventDefault();

    const formEditProfile = document.getElementById("formEditProfile");
    if (formEditProfile.checkValidity()) {
      putRequestProfile();
    }

    formEditProfile.classList.add("was-validated");
  });

  // Event listener for the Edit Profile button
  // when this button is clicked, remove past form validations
  // and prepopulate the Full Name and Bio fields
  const btnEditProfile = document.getElementById("btnEditProfile");
  btnEditProfile.addEventListener("click", () => {
    formEditProfile.classList.remove("was-validated");
  });

  // remove the Edit Profile button on someone else's profile page
  if (username !== currentUser) {
    btnEditProfile.remove();
    document.getElementById("modalEditProfile").remove();
  } else {
    btnEditProfile.classList.remove("d-none");
  }

  // change the user's @ tag and show their posts
  changeUserTag(username);
  viewProfilePosts(username);
  displayFriends();
}

// change the user's @ tag
function changeUserTag(username) {
  document.getElementById("viewUser").innerHTML = `
    @${username}</h1>
  `;
}

async function viewProfilePosts(username) {
  const myHeaders = new Headers();

  const loginData = getLoginData();
  const userToken = loginData.token;
  myHeaders.append("Authorization", `Bearer ${userToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${apiBaseURL}/api/posts?username=${username}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let numPosts = result.length;

      //Displaying number of posts on profile
      document.getElementById("postNumber").innerText = numPosts;
      let numLikes = 0;

      //for loop post iteration
      for (let index = 0; index < numPosts; index++) {
        const post = result[index];
        console.log(post);

        numLikes += post.likes.length;

        document
          .getElementById("posts-container")
          .insertAdjacentHTML("beforebegin", createUserPost(post));
      }

      document.getElementById("postLikes").innerText = numLikes;
    })
    .catch((error) => console.log("error", error));
}

//View user info with properties: fullname, un, bio, created and updated
async function getUserInfo(username) {
  const myHeaders = new Headers();
  const loginData = getLoginData();
  const userToken = loginData.token;

  myHeaders.append("Authorization", `Bearer ${userToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${apiBaseURL}/api/users/${username}`, requestOptions).catch(
    (error) => console.log("error", error)
  );
}

function prepopulateEditProfileForm(result) {
  document.getElementById("editFullName").value = result.fullName;
  document.getElementById("editBio").value = result.bio;
}

function updateProfile(result) {
  document.getElementById("userFullName").innerText = result.fullName;
  document.getElementById("userBio").innerText = result.bio;
}

function putRequestProfile() {
  const myHeaders = new Headers();

  const loginData = getLoginData();

  const userName = loginData.username;

  const userToken = loginData.token;

  const fullNameValue = document.getElementById("editFullName").value;

  const bioValue = document.getElementById("editBio").value;

  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${userToken}`);

  const raw = JSON.stringify({
    //Grab values from edit profile values: fullname and bio
    bio: `${bioValue}`,
    fullName: `${fullNameValue}`,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${apiBaseURL}/api/users/${userName}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      updateProfile(result);
      prepopulateEditProfileForm(result);
    })
    .catch((error) => {
      console.log("error", error);
    })
    .finally(closeModal("modalEditProfile"));
}

// Fetch friends
function displayFriends() {
  var myHeaders = new Headers();

  const loginData = getLoginData();
  const userToken = loginData.token;

  myHeaders.append("Authorization", `Bearer ${userToken}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let friendList = "";

  fetch(
    "http://microbloglite.us-east-2.elasticbeanstalk.com/api/users?limit=10&offset=5",
    requestOptions
  )
    .then((response) => response.json())
    .then((friends) => {
      console.log(friends);
      for (let index = 0; index < 10; index++) {
        const friendUsername = friends[index].username;

        // Check if the friendList already contains the current username
        if (!friendList.includes(friendUsername)) {
          let friend = friendUsername;
          friendList += `
          <div class="list-group ">
            <a href="/profile/?username=${friend}" class="list-group-item list-group-item-action">@${friend}</a>
          </div>
        `;
        } 

        }
        
      document.getElementById('profileFriends').innerHTML = friendList;
    })
    .catch((error) => console.log("error", error));
}
