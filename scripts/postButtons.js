function createDeleteButton(parentNode, postId) {
  const deleteBtn = document.createElement("button");
  //label and display button
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="black" class="bi bi-trash3-fill d-block m-auto" viewBox="0 0 16 16">
      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
    </svg>
    `;
  deleteBtn.classList.add(
    "btn",
    "btn-sm",
    "btn-delete",
    "d-block",
    "ms-auto",
    "p-0"
  );

  //add a click event listener to the delete button
  deleteBtn.addEventListener("click", async () => {
    const response = await deletePost(postId);

    if (response.ok) {
      const topAncestor = parentNode.parentNode.parentNode.parentNode;

      // the grid only exists on the home page, not on the profile page
      // thus, if we're on the profile page, then just remove the DOM node
      const grid = $(".grid").length;
      if (grid) {
        $(".grid")
          .masonry("remove", $(topAncestor))
          // layout remaining item elements
          .masonry("layout");
      } else {
        topAncestor.remove();
      }
      //remove the whole card by getting the top ancestor
      updateProfilePostsNumber(-1); // subtract 1 from the number of posts
      // subtract the number of likes on the post from total likes
      updateProfileLikes(parentNode.dataset.likes * -1);
      showToast(true, "Post successfully deleted!");
    } else {
      showToast(false, "Oh no! Failed to delete the post.");
    }
  });

  //append the delete button to the parent node
  parentNode.appendChild(deleteBtn);
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
      parentNode.dataset.likes = parseInt(parentNode.dataset.likes) - 1;
      updateProfileLikes(-1);

      // update the number of likes on the post
      const numLikes = parentNode.dataset.likes;
      const numLikesText = parentNode.querySelector(".post-likes");
      numLikesText.textContent = `
        ${numLikes} ${numLikes === 1 ? "Like" : "Likes"}
      `;
    } else {
      showToast(false, "Oh no! Failed to unlike the post.");
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
      parentNode.dataset.likes = parseInt(parentNode.dataset.likes) + 1;
      updateProfileLikes(1);

      // update the number of likes on the post
      const numLikes = parentNode.dataset.likes;
      const numLikesText = parentNode.querySelector(".post-likes");
      numLikesText.textContent = `
        ${numLikes} ${numLikes === "1" ? "Like" : "Likes"}
      `;
    } else {
      showToast(false, "Oh no! Failed to like the post.");
    }
  });
  parentNode.appendChild(btn);
}

// return the like id of the post that the current user has liked
function isLiked(likesArray) {
  if (!likesArray) return 0;

  for (let i = 0; i < likesArray.length; i++) {
    if (likesArray[i].username === getLoginData().username) {
      return likesArray[i]._id;
    }
  }
}

function getLikeButton(parentNode, likesArray, postId) {
  const likeId = isLiked(likesArray);

  if (likeId) {
    createLikedButton(parentNode, postId, likeId);
  } else {
    createUnlikedButton(parentNode, postId);
  }
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

  return fetch(apiBaseURL + `/api/posts/${postId}`, requestOptions);
}

function updateProfilePostsNumber(numPosts) {
  const postNumber = document.getElementById("postNumber");
  if (postNumber) {
    postNumber.textContent = parseInt(postNumber.textContent) + numPosts;
  }
}

function updateProfileLikes(numLikes) {
  const postLikes = document.getElementById("postLikes");
  if (postLikes) {
    const currentLikes = parseInt(postLikes.textContent);
    if (currentLikes + numLikes < 0) {
      postLikes.textContent = 0;
    } else {
      postLikes.textContent = parseInt(postLikes.textContent) + numLikes;
    }
  }
}
