import { h, render } from "preact";
import App from "./app";
import browser from "webextension-polyfill";

// Function to append the Preact app to a target element
function appendPreactApp() {
  const target = getTargetElement();

  console.log("target: ", target);
  if (target) {
    render(<App />, target);
  }
}

function getTargetElement() {
  if (!window) {
    return;
  }

  const targetInBacklogView = "ghx-detail-head";
  const targetInSingleView = "stalker";
  let targetElementId;

  const currentUrl = new URL(window.location);

  if (currentUrl.pathname === "/secure/RapidBoard.jspa") {
    targetElementId = targetInBacklogView;
  } else if (
    currentUrl.pathname.startsWith("/browse/") ||
    currentUrl.pathname.startsWith("/projects/")
  ) {
    targetElementId = targetInSingleView;
  }

  const targetParent = document.getElementById(targetElementId);

  if (!targetParent) {
    return;
  }

  const div = document.createElement("div");
  div.id = "bulkAdding";
  targetParent.appendChild(div);

  const appTarget = document.getElementById(div.id);
  return appTarget;
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "appendPreactApp") {
    appendPreactApp();
  }
});
