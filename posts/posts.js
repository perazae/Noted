/* Posts Page JavaScript */
"use strict";

window.onload = init;

function init() {
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
