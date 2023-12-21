"use strict";

window.onload = init;

async function init() {
  const urlParams = new URLSearchParams(location.search);
  let currentUser = getLoginData().username;
  let username = "";

  // check if we're visiting someone else's profile
  if (urlParams.has("username") === true) {
    username = urlParams.get("username");
  } else {
    username = currentUser;
  }

  // check if the user exists from the given username in the URL params
  const response = await getUserInfo(username);
  if (response.ok) {
    const userInfo = await response.json();
    populateEditProfileForm(userInfo);
    updateProfile(userInfo);
  } else {
    // if the response is not OK, then the given username doesn't exist
    // redirect to the current user's profile page
    window.location.href = "/profile";
  }

  const btnEditProfile = document.getElementById("btnEditProfile");
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
}

// change the user's @ tag
function changeUserTag(username) {
  document.getElementById("viewUser").innerHTML = `
    @${username}</h1>
  `;
}

async function viewProfilePosts(username) {
  var myHeaders = new Headers();

  const loginData = getLoginData();
  const userToken = loginData.token;
  myHeaders.append("Authorization", `Bearer ${userToken}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`${apiBaseURL}/api/posts?username=${username}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      let postNums = result.length;

      //Displaying number of posts on profile
      document.getElementById("postNumber").innerHTML = postNums;
      let posts = "";
      let likes = "";

      //for loop post iteration
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        console.log(element);

        if (likes.length === true) {
          likes += 1;
        }

        //Formatting time of post
        const timeStamp = element.createdAt;
        const date = new Date(timeStamp);

        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        };

        //Newly formatted time of post to display
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
          date
        );

        const userPost = `
      <div class="card m-3 col-12 shadow p-3 mb-5 bg-white rounded" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">@${element.username}</h5>
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
      `;
        posts += userPost;
      }
      document.getElementById("userPosts").innerHTML += posts;

      if (likes == 0) {
        likes += 0;
      }

      document.getElementById("postLikes").innerHTML += likes;
    })
    .catch((error) => console.log("error", error));
}

//View user info with properties: fullname, un, bio, created and updated
async function getUserInfo(username) {
  var myHeaders = new Headers();
  const loginData = getLoginData();
  const userToken = loginData.token;

  myHeaders.append("Authorization", `Bearer ${userToken}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return fetch(`${apiBaseURL}/api/users/${username}`, requestOptions).catch(
    (error) => console.log("error", error)
  );
}

function populateEditProfileForm(result) {
  document.getElementById("editFullName").innerHTML = result.fullName;
  document.getElementById("editBio").innerHTML = result.bio;
}

function updateProfile(result) {
  document.getElementById("userFullName").innerHTML = result.fullName;
  document.getElementById("userBio").innerHTML = result.bio;
}

function putRequestProfile() {
  var myHeaders = new Headers();

  const loginData = getLoginData();

  const userName = loginData.username;

  const userToken = loginData.token;

  const fullNameValue = document.getElementById("editFullName").value;

  const bioValue = document.getElementById("editBio").value;

  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${userToken}`);

  var raw = JSON.stringify({
    //Grab values from edit profile values: fullname and bio
    bio: `${bioValue}`,
    fullName: `${fullNameValue}`,
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${apiBaseURL}/api/users/${userName}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      updateProfile(result);
    })
    .catch((error) => {
      console.log("error", error);
    })
    .finally(closeModal("modalEditProfile"));
}
