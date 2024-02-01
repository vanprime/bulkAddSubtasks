import { h, render } from "preact";
import App from "./app";
import browser from "webextension-polyfill";

// Function to append the Preact app to a target element
function togglePreactApp() {
  const targetContainer = getTargetElement();

  const div = document.createElement("div");
  div.id = "bulkAddingContainer";
  targetContainer.appendChild(div);

  const appTarget = document.getElementById(div.id);
  const appInstance = document.getElementById("bulkAddingApp");

  if (appTarget && appInstance) {
    targetContainer.removeChild(appTarget);
    return;
  }

  if (appTarget) {
    render(<App />, appTarget);
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
  } else {
    return targetParent;
  }
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "togglePreactApp") {
    if (
      window.location.href.includes("/jira/") ||
      window.location.host.startsWith("jira.")
    ) {
      // This looks like a Jira instance, proceed with the script
      togglePreactApp();
    }
  }
});
