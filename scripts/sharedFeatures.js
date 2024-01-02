"use strict";

function showToast(isSuccess, message) {
  const toast = isSuccess
    ? document.getElementById("toast-success")
    : document.getElementById("toast-error");

  const toastBody = toast?.querySelector(".toast-body");

  if (toast) {
    toastBody.textContent = message;
    bootstrap.Toast.getOrCreateInstance(toast).show();
  }
}

//Get the button
let btnScrollToTop = document.getElementById("btn-back-to-top");
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    btnScrollToTop.style.display = "block";
  } else {
    btnScrollToTop.style.display = "none";
  }
}

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// When the user clicks on the button, scroll to the top of the document
window.addEventListener("scroll", scrollFunction);
btnScrollToTop.addEventListener("click", backToTop);
