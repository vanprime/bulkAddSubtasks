import browser from "webextension-polyfill";

browser.action.onClicked.addListener((tab) => {
  browser.tabs.sendMessage(tab.id, { action: "toggleReactApp" });
});
