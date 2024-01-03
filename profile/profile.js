"use strict";

window.onload = init;

let currentProfile = "";

async function init() {
  const urlParams = new URLSearchParams(location.search);
  let currentUser = getLoginData().username;
  let userInfo;

  // check if we're visiting someone else's profile
  if (urlParams.has("username") === true) {
    currentProfile = urlParams.get("username");
  } else {
    currentProfile = currentUser;
  }

  // check if the user exists from the given username in the URL params
  const response = await getUserInfo(currentProfile);
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
  if (currentProfile !== currentUser) {
    btnEditProfile.remove();
    document.getElementById("modalEditProfile").remove();

    // colors array for user profiles
    const colors = [
      "#3498db",
      "#e74c3c",
      "#2ecc71",
      "#f39c12",
      "#9b59b6",
      "#1abc9c",
      "#d35400",
      "#34495e",
      "#c0392b",
      "#27ae60",
    ];
    const covers = [
      `url(https://wallpapercave.com/wp/iu98stB.jpg)`,
      `url(https://wallpaperaccess.com/full/1713744.jpg)`,
      `url(https://wallpaperaccess.com/full/2825826.gif)`,
      `url(https://wallpapers.com/images/hd/orange-trees-in-fall-scenic-kef79jh8aaok0jty.jpg)`,
      `url(https://wallpaperaccess.com/full/316663.jpg)`,
      `url(https://cdna.artstation.com/p/marketplace/presentation_assets/002/977/574/large/file.jpg?1693378178)`,
      `url(https://i.pinimg.com/originals/67/7a/33/677a33611a9910bfdc7503de78c08323.jpg)`,
      `url(https://wallpapers.com/images/featured/4k-oaax18kaapkokaro.jpg)`,
      `url(https://wallpaperaccess.com/full/7270387.gif)`,
      `url(https://wallpaperaccess.com/full/8088665.gif)`,
    ];

    let randomCover = Math.floor(Math.random() * covers.length);
    let randomColor = Math.floor(Math.random() * colors.length);
    document.getElementById("backgroundCover").style.background =
      covers[randomCover];
    document.getElementById("backgroundCover").style.backgroundSize = "cover";
    document.getElementById("backgroundCover").style.backgroundRepeat =
      "no-repeat";
    document.getElementById("backgroundCover").style.backgroundPosition =
      "center center";
    document.getElementById("backgroundCover").style.backgroundAttachment =
      "fixed";
    document.getElementById("coverColor").style.background =
      colors[randomColor];
  } else {
    btnEditProfile.classList.remove("d-none");
  }

  // change the user's @ tag and show their posts
  changeUserTag(currentProfile);
  viewProfilePosts(currentProfile);
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
      document.getElementById("postNumber").textContent = numPosts;
      let numLikes = 0;

      //for loop post iteration
      for (let index = 0; index < numPosts; index++) {
        const post = result[index];

        numLikes += post.likes.length;

        addPostToContainer("beforeend", post);
      }

      document.getElementById("postLikes").textContent = numLikes;
    })
    .catch((error) => console.log(error));
    // .catch((error) => showToast(false, "Error retrieving posts."));
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
    (error) => showToast(false, "Error retrieving user information.")
  );
}

function prepopulateEditProfileForm(result) {
  document.getElementById("editFullName").value = result.fullName;
  document.getElementById("editBio").value = result.bio;
}

function updateProfile(result) {
  document.getElementById("userFullName").textContent = result.fullName;
  document.getElementById("userBio").textContent = result.bio;
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
      showToast(true, "Profile successfully updated!");
    })
    .catch((error) => {
      showToast(false, "Ran into error trying to update your profile.");
    })
    .finally(closeModal("modalEditProfile"));
}

// Fetch friends
function displayFriends() {
  var myHeaders = new Headers();

  const loginData = getLoginData();
  const userToken = loginData.token;
  const currentUser = loginData.username;

  myHeaders.append("Authorization", `Bearer ${userToken}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  let friendList = [];

  fetch(`${apiBaseURL}/api/users?limit=10&offset=5`, requestOptions)
    .then((response) => response.json())
    .then((friends) => {
      const uniqueFriends = {}

      for (let index = 0; index < 10; index++) {
        const friendUsername = friends[index].username;
        let friend = friendUsername.toLowerCase().trim();

        // Check if the friendUsername is not the current user
        if (!uniqueFriends[friend] && friendUsername !== currentProfile){
          uniqueFriends[friend] = 1;
          friendList += `
              <div class="list-group ">
                <a href="/profile/?username=${friendUsername}" class="list-group-item list-group-item-action">@${friendUsername}</a>
              </div>
            `;
        }
      }
      document.getElementById("profileFriends").innerHTML = friendList;
    })
    .catch((error) => showToast(false, "Error retrieving friend list."));
}
