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
    .then((newPost) => {
      resetCreatePostModal();
      // update posts section
      updatePostsSection(newPost);
    })
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

// update the post section on profile page after creating a new post
// only if the current profile page belongs to the current user
function updatePostsSection(newPost) {
  // DOM manipulation
}
