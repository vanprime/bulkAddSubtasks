# bulkAddSubtasks

A not so smart chrome extension to bulk add subtasks to the currently viewed Jira issue.

# usage

1. Open Chrome: Start by opening the Google Chrome browser.
2. Access Extension Management Page: Type `chrome://extensions/` in the address bar and press Enter.
3. Enable Developer Mode: In the top right corner of the Extensions page, you’ll see a switch for Developer mode. Turn it on. This allows you to load unpacked extensions.
4. Load the Unpacked Extension: Click on the load unpacked button which will appear in the corner after you enable Developer Mode. A file dialog will open. Navigate to your clone of the repo and click open.
5. On a\* page showing a detail view of the issue you want to add the subtasks to, klick on the extension icon. A div with an input field and a button will appert. Insert all the subtask summaries you want to add, seperated by ;
6. Reload the page - sadly

# auth

Auth is handled by your session. The JIRA API relies on browser-based authentication (like cookies or session tokens) for requests originating from the same domain. When the extension's script makes a fetch request to the JIRA API from a page on the same domain, it automatically includes these credentials, thanks to the browser's same-origin policy.

# To do

- adjust container styling based on rendered page
- trigger on page load instead of button click (20 Storypoints ez)
- add build and release pipeline
- clear input field after submission
- add extension configuration to remove API url and enter custom ID selectors so that it could be published
