/* Posts Page JavaScript */
"use strict";

window.onload = init;

//prevents previous posts from loading again
let loading = false;
//checks to see if there are more posts
let hasMorePosts = true;
//offset for fetching the posts 
let initialOffset = 0;

//initalize
function init() {
  const btnCreatePost = document.getElementById("btnCreatePost");
  btnCreatePost.addEventListener("click", clearForm);

  // Because we are using an infinite scroll feature, 
  // it won't activate if the window can't scroll or no scroll bar exists.
  // To prevent this, we need to at least fill the initial screen with posts,
  // so that the scroll bar can exist.
  // The following interval will fill the screen with posts every second
  // until the document height is greater than the screen height
  let fillScreenWithPosts = setInterval(async () => {
    const windowHeight = window.screen.height;
    const documentHeight = document.documentElement.scrollHeight;

    if (windowHeight >= documentHeight) {
      await displayAllUserPosts(initialOffset);
      initialOffset += 10;
    } else {
      clearInterval(fillScreenWithPosts);
    }
  }, 1000);
}

/**This function will allow the user to load posts as they scroll
 * in other words, it is an infinite scrolling function until the last post is displayed
 */
window.onscroll = async function (event) {
  if (
    hasMorePosts &&
    !loading &&
    window.innerHeight + window.scrollY + 40 >= document.body.offsetHeight
  ) {
    //Sets loading variable to true to prevent duplicates
    loading = true;
    //Adds an increment of 10 to posts to display more posts
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
    const response = await fetch(
      `${apiBaseURL}/api/posts?limit=10&offset=${initialOffset}`,
      requestOptions
    );
    data = await response.json();

    // Create a bootstrap card for each post
    data.forEach((post) => {
      addPostToContainer("beforeend", post);
    });
  } catch (error) {
    showToast(false, "Error fetching posts.");
  }

  return data;
}
