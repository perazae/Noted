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
