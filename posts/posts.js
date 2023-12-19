/* Posts Page JavaScript */
"use strict";

window.onload = init;

function init() {
  const btnCreatePost = document.getElementById("btnCreatePost");
  btnCreatePost.addEventListener("click", clearForm);
  displayAllUserPosts();
}

async function displayAllUserPosts() {
  const baseURL = "https://microbloglite.onrender.com/api/posts";

  const loginData = getLoginData();
  const token = loginData.token;

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
                        <a href="#" class="btn btn-primary" onclick="deletePost(${post.id}, '${token}')">Delete</a>
                    </div>
                </div>
            `;

      postsContainer.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Delete posts function 
async function deletePost(postId, token) {
  const baseURL = `https://microbloglite.onrender.com/api/posts/${postId}`;

  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(baseURL, requestOptions);
    if (response.ok) {
      console.log(`Post with ID ${postId} deleted successfully`);
      displayAllUserPosts();
    } else {
      console.error("Error deleting post:", response.status);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
