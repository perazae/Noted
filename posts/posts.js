/* Posts Page JavaScript */
"use strict";

window.onload = init;
//initalize
function init() {
  const btnCreatePost = document.getElementById("btnCreatePost");
  btnCreatePost.addEventListener("click", clearForm);
  displayAllUserPosts(0);
}

let index = 0
//prevents previous posts from loading again
let loading = false;
//checks to see if there are more posts
let hasMorePosts = true;
let initialOffset = 10;
/**This function will allow the user to load posts as they scroll
 * in other words, it is an infinite scrolling function until the last post is displayed
 */

window.onscroll = async function (event) {
  if (hasMorePosts && !loading && (window.innerHeight + window.scrollY + 40 >= document.body.offsetHeight)){
    //Sets loading variable to true to prevent duplicates
    loading = true;
    
    let data = await displayAllUserPosts(initialOffset);
    initialOffset += 10;

    //Set loading variable to false once everything is loaded
    loading = false;

    //if no more posts exist, it will stop
    if (data.length === 0) {
      hasMorePosts = false;
    }

    //Check if there are no more posts to load
    if (!hasMorePosts) {
      window.onscroll = null;
    }
  }
};

async function displayAllUserPosts(initialOffset) {
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

  let data;
  try {
    const response = await fetch(`${apiBaseURL}/api/posts?limit=10&offset=${initialOffset}`, requestOptions);
    data = await response.json();
    //bootstrap card
    const postsContainer = document.getElementById("posts-container");
    // postsContainer.innerHTML = ""; // refresh card
    //loop to display data into card
    data.forEach((post) => {

      postsContainer.insertAdjacentHTML("beforeend", createUserPost(post));

      const parentNode = document.getElementById(`btns-${post._id}`);
      // create the delete button for this post
      createDeleteButton(parentNode, post._id);

      // insert the like button into the card body
      getLikeButton(parentNode, post.likes, post._id);
      
      index += 1;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return data;
}
