/* Posts Page JavaScript */
"use strict";
async function displayAllUserPosts() {
  const baseURL = "https://microbloglite.onrender.com/api/posts";

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjMiLCJpYXQiOjE3MDI1MTEwOTQsImV4cCI6MTcwMjU5NzQ5NH0.Zq8iXS6gDfUqnXXRKTWRuyeHYcF1OMxINtljfcFtF8Y";

  const requestOptions = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    redirect: "follow",
  };

  try {
    const response = await fetch(baseURL, requestOptions);
    const data = await response.json();

    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = ""; // refresh card

    data.forEach((post) => {
      let userName = post.username;
      let postText = post.text;

      let cardHTML = `
                <div class="card" style="width: 18rem;">
                    <img src="..." class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${userName}</h5>
                        <p class="card-text">${postText}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            `;

      postsContainer.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

const formCreatePost = document.getElementById("formCreatePost");
formCreatePost.addEventListener("submit", (event) => {
  event.preventDefault();

  // While testing, putting preventDefault() in an if/else statement
  // prevented the createPost() function from sending a successful POST request
  // Thus, preventDefault() will be used outside of the following if statement,
  // and a workaround to closing the modal upon successful submit is created in the
  // resetCreatePostModal() function
  if (formCreatePost.checkValidity()) {
    createPost();
  }

  formCreatePost.classList.add("was-validated");
});

function createPost() {
  const text = document.getElementById("inputPostText").value;

  const apiBaseURL = "https://microbloglite.onrender.com";
  const options = {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      Authorization: `Bearer ${getLoginData().token}`,
      "Content-Type": "application/json",
    },
  };

  fetch(apiBaseURL + "/api/posts", options)
    .then((response) => response.json())
    .then((data) => resetCreatePostModal())
    .catch((error) => alert("Ran into server error when creating post"));
}

// Reset form input fields and close modal
function resetCreatePostModal() {
  clearForm();

  // Manually close the modal
  const modalCreatePost = document.getElementById("modalCreatePost");
  const modal = bootstrap.Modal.getInstance(modalCreatePost);
  modal.hide();
}

// Remove present validation on the form and reset text field
function clearForm() {
  formCreatePost.classList.remove("was-validated");
  document.getElementById("inputPostText").value = "";
}

const btnCreatePost = document.getElementById("btnCreatePost");
btnCreatePost.addEventListener("click", clearForm);
