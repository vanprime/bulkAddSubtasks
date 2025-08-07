import { createRoot } from "react-dom/client";
import App from "./app";
import browser from "webextension-polyfill";

// Function to append the React app to a target element
function toggleReactApp(containerId) {
  const targetContainer = document.getElementById(containerId);

  if (!targetContainer) {
    return;
  }

  const appTargetId = "bulkAddingContainer";
  const appId = "bulkAddingApp";
  const appTarget = createAppContainer(targetContainer, appTargetId);
  const appInstance = document.getElementById(appId);

  if (appTarget && appInstance) {
    targetContainer.removeChild(appTarget);
    return;
  }

  if (appTarget) {
    const root = createRoot(appTarget);
    root.render(<App id={appId} />);
  }
}

function createAppContainer(targetContainer, appTargetId) {
  const div = document.createElement("div");
  div.id = appTargetId;
  targetContainer.appendChild(div);
  const appTarget = document.getElementById(div.id);
  return appTarget;
}

browser.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleReactApp") {
    browser.storage.sync.get("configs").then((result) => {
      if (result.configs) {
        const currentUrl = window.location.href;
        for (const config of result.configs) {
          if (currentUrl.includes(config.url)) {
            toggleReactApp(config.containerId);
            break;
          }
        }
      }
    });
  }
});