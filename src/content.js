import { h, render } from "preact";
import App from "./app";
import browser from "webextension-polyfill";

// Function to append the Preact app to a target element
function togglePreactApp() {
  const view = getView();
  const targetContainer = getTargetElement(view);

  if (!targetContainer) {
    return;
  }

  const appTargetId = "bulkAddingContainer";
  const appId = "bulkAddingApp";
  const appTarget = createAppContainer(targetContainer, appTargetId);
  const appInstance = document.getElementById(appId);

  const appstyle = getStyle(view);

  if (appTarget && appInstance) {
    targetContainer.removeChild(appTarget);
    return;
  }

  if (appTarget) {
    render(<App style={appstyle} id={appId} />, appTarget);
  }
}

function getView() {
  if (!window) {
    return;
  }

  const currentUrl = new URL(window.location);

  if (currentUrl.pathname === "/secure/RapidBoard.jspa") {
    return "backlog";
  } else if (
    currentUrl.pathname.startsWith("/browse/") ||
    currentUrl.pathname.startsWith("/projects/")
  ) {
    return "single";
  }
}

function getTargetElement(view) {
  if (!window) {
    return;
  }

  const targetInBacklogView = "ghx-detail-head";
  const targetInSingleView = "stalker";
  let targetElementId;

  if (view === "backlog") {
    targetElementId = targetInBacklogView;
  } else if (view === "single") {
    targetElementId = targetInSingleView;
  } else {
    targetElementId = "page";
  }

  const targetParent = document.getElementById(targetElementId);

  if (!targetParent) {
    return;
  } else {
    return targetParent;
  }
}

function getStyle(view) {
  const element = getTargetElement(view);

  let style = {};

  if (view === "backlog") {
    style = {
      marginTop: "12px",
      marginRight: "8px",
    };
  }

  if (view === "single") {
    const firstChild = element.children[0];
    const nestedChild = firstChild.children[0];
    const targetElementStyle = window.getComputedStyle(nestedChild);
    style = {
      marginLeft: targetElementStyle.paddingLeft,
      marginRight: targetElementStyle.paddingRight,
      marginBottom: targetElementStyle.paddingTop,
    };
  }

  return style;
}

function createAppContainer(targetContainer, appTargetId) {
  const div = document.createElement("div");
  div.id = appTargetId;
  targetContainer.appendChild(div);
  const appTarget = document.getElementById(div.id);
  return appTarget;
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
