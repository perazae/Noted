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
      let userName = post.username;
      let postText = post.text;

      let cardHTML = `
        <div class="card" style="width: 18rem;">
            <div class="card-body" id="card-${index}">
                <a href="/profile/?username=${userName}"><h5 class="card-title">${userName}</h5></a>
                <p class="card-text">${postText}</p>
                <p class="card-text">${post.likes.length} Likes</p>
            </div>
        </div>
      `;

      postsContainer.insertAdjacentHTML("beforeend", cardHTML);

      // insert the like button into the card body
      const parentNode = document.getElementById(`card-${index}`);
      getLikeButton(parentNode, post.likes, post._id);

      // create the delete button for this post
      createDeleteButton(parentNode, post._id);

      index += 1;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return data;
}

function createDeleteButton(parentNode, postId) {
  const deleteBtn = document.createElement("button");
  //label and display button
  deleteBtn.innerHTML = "Delete";
  deleteBtn.classList.add("btn", "btn-danger");

  //add a click event listener to the delete button
  deleteBtn.addEventListener("click", async () => {
    await deletePost(postId);

    //remove the card/parent node
    parentNode.remove();
  });

  //append the delete button to the parent node
  parentNode.appendChild(deleteBtn);
}

// return the like id of the post that the current user has liked
function isLiked(likesArray) {
  for (let i = 0; i < likesArray.length; i++) {
    if (likesArray[i].username === getLoginData().username) {
      return likesArray[i]._id;
    }
  }
  return 0;
}

function getLikeButton(parentNode, likesArray, postId) {
  const likeId = isLiked(likesArray);

  if (likeId) {
    createLikedButton(parentNode, postId, likeId);
  } else {
    createUnlikedButton(parentNode, postId);
  }
}

/**
 * This function creates a "Liked" button, which represents that
 * the corresponding post has an active "Like" on it.
 * In other words, this post has already been liked by the current user.
 */
function createLikedButton(parentNode, postId, likeId) {
  const btn = document.createElement("div");
  btn.classList.add("btn-like", "liked");

  // Since the corresponding post is Liked, add a click event listener
  // that will delete this Like
  // In other words, "unlike" the corresponding post
  btn.addEventListener("click", async () => {
    const response = await deleteLike(likeId);

    // Upon successfully unliking a post, delete this Like button
    // and replace it with an 'Unliked' button, which means that
    // the corresponding post is no longer Liked
    if (response.ok) {
      btn.remove();
      createUnlikedButton(parentNode, postId);
    } else {
      alert("Ran into error when unliking post");
    }
  });
  parentNode.appendChild(btn);
}

/**
 * This function creates a "Unliked" button, which represents that
 * the corresponding post does not have an active "Like" on it.
 * In other words, this post is not liked by the current user.
 */
function createUnlikedButton(parentNode, postId) {
  const btn = document.createElement("div");
  btn.classList.add("btn-like");

  // Since the corresponding post is Unliked, add a click event listener
  // that will create a Like
  // In other words, add a "like" to the corresponding post
  btn.addEventListener("click", async () => {
    const response = await createLike(postId);

    // Upon successfully liking a post, delete this Unliked button
    // and replace it with an 'Liked' button, which means that
    // the corresponding post is now Liked
    if (response.ok) {
      playLikeAnimation(btn);
      const like = await response.json();
      createLikedButton(parentNode, postId, like._id);

      // removing the button prevents the animation from playing
      // btn.remove();
    } else {
      alert("Ran into error when liking post");
    }
  });
  parentNode.appendChild(btn);
}

async function createLike(postId) {
  const options = {
    method: "POST",
    body: JSON.stringify({ postId }),
    headers: {
      Authorization: `Bearer ${getLoginData().token}`,
      "Content-Type": "application/json",
    },
  };

  return fetch(apiBaseURL + "/api/likes", options);
}

async function deleteLike(likeId) {
  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getLoginData().token}`,
    },
  };

  return fetch(apiBaseURL + `/api/likes/${likeId}`, options);
}

// Delete posts function
async function deletePost(postId) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getLoginData().token}`,
    },
  };

  try {
    const response = await fetch(
      apiBaseURL + `/api/posts/${postId}`,
      requestOptions
    );
    if (response.ok) {
      console.log(`Post with ID ${postId} deleted successfully`);
    } else {
      console.error("Error deleting post:", response.status);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}
