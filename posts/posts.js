/* Posts Page JavaScript */
"use strict";

window.onload = init;
//initalize
function init() {
  const btnCreatePost = document.getElementById("btnCreatePost");
  btnCreatePost.addEventListener("click", clearForm);
  displayAllUserPosts(0);
}

let index = 0;
//prevents previous posts from loading again
let loading = false;
//checks to see if there are more posts
let hasMorePosts = true;
let initialOffset = 10;

/**This function will allow the user to load posts as they scroll
 * in other words, it is an infinite scrolling function until the last post is displayed
 */

//Get the button
let btnScrollToTop = document.getElementById("btn-back-to-top");

window.onscroll = async function (event) {
  // When the user scrolls down 20px from the top of the document, show the button
  scrollFunction();

  if (
    hasMorePosts &&
    !loading &&
    window.innerHeight + window.scrollY + 40 >= document.body.offsetHeight
  ) {
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

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnScrollToTop.style.display = "block";
  } else {
    btnScrollToTop.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
btnScrollToTop.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

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
