function createDeleteButton(parentNode, postId) {
  const deleteBtn = document.createElement("button");
  //label and display button
  deleteBtn.innerHTML = "Delete";
  deleteBtn.classList.add("btn", "btn-danger", "d-block", "ms-auto");

  //add a click event listener to the delete button
  deleteBtn.addEventListener("click", async () => {
    await deletePost(postId);

    //remove the whole card by getting the top ancestor
    parentNode.parentNode.parentNode.remove();
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

      // removing the button prevents the animation from playing
      // btn.remove();
    } else {
      showToast(false, "Oh no! Failed to like the post.");
    }
  });
  parentNode.appendChild(btn);
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
      showToast(true, `Post successfully deleted`);
    }
  } catch (error) {
    showToast(false, "Oh no! Failed to delete the post.");
  }
}
