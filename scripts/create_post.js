"use strict";
const btnCreatePost = document.getElementById("btnCreatePost");
btnCreatePost.addEventListener("click", clearForm);

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
  closeModal("modalCreatePost");
}

// Remove present validation on the form and reset text field
function clearForm() {
  const formCreatePost = document.getElementById("formCreatePost");
  formCreatePost.classList.remove("was-validated");
  document.getElementById("inputPostText").value = "";
}

function closeModal(modalElementId) {
  // Manually close the modal
  const modalEditProfile = document.getElementById(modalElementId);
  const modal = bootstrap.Modal.getInstance(modalEditProfile);
  modal.hide();
}

/**
 * This function accepts an object containing the properties of a post
 * @param {Object} post
 * @returns {string} HTML
 */
function createUserPost(post) {
  //Formatting time of post
  const timeStamp = post.createdAt;
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
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  const userPost = `
  <div class="card w-100 shadow p-3 mb-5 bg-white rounded" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">@${post.username}</h5>
      <div class="shadow-sm p-3 mb-5 bg-white rounded border-top">
        <p class="card-text"><h4 class="text-center"><strong>${post.text}</strong></h4></p>
        <h6 class="card-subtitle mb-2 text-body-secondary text-center"><em>Noted: ${formattedDate}</em></h6>
      </div>
      <div id="btns-${post._id}">
      </div>
    </div>
  </div>
  `;
  return userPost;
}
