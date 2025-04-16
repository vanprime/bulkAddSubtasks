## Top-Level File Descriptions

This section describes the files located directly within the `/src` directory.

*   **[`app.jsx`](./app.jsx):**
    *   The main Preact component that renders the extension's user interface (text area, button, progress bar, error messages).
    *   Manages UI state (input text, loading status, progress, errors).
    *   Orchestrates the sequence of function calls (`getProjectVariables`, `getCreateIssueMetadata`, etc.) required to submit sub-tasks when the button is clicked.
*   **[`background.js`](./background.js):**
    *   The extension's background script (service worker for MV3).
    *   Listens for clicks on the browser action icon.
    *   Sends a message to the active tab's content script (`content.js`) to toggle the UI.
*   **[`codex.md`](./codex.md):**
    *   This documentation file.
*   **[`constants.js`](./constants.js):**
    *   Defines constant values used elsewhere in the extension. Currently holds the hardcoded `subTaskId` (ID for the Sub-task issue type in Jira).
*   **[`content.js`](./content.js):**
    *   The content script injected into Jira web pages.
    *   Listens for messages from the background script (`background.js`).
    *   Handles injecting and removing the Preact UI (`app.jsx`) into the appropriate DOM element on the Jira page based on the current view (Backlog or Single Issue).
    *   Determines the correct target element and applies view-specific styling.
*   **[`index.css`](./index.css):**
    *   The main stylesheet for the extension's UI.
    *   Imports Tailwind CSS base, components, and utilities.
    *   Defines CSS custom properties (variables) for the color theme and border radius.
*   **[`manifest.json`](./manifest.json):**
    *   The core configuration file for the browser extension.
    *   Defines the manifest version, name, description, version (pulled from `package.json` via Vite config), permissions (`activeTab`, `scripting`), background script, icons, and content script details (matching URLs and script to inject).

---

### Suggestions for Improvement:

1.  **Error Handling in `content.js`:** Add more robust error handling in `content.js` for cases where target DOM elements (`ghx-detail-head`, `stalker`) might not be found, preventing potential script errors if Jira's UI changes.
2.  **Configuration for `constants.js`:** Instead of hardcoding `subTaskId` in [`constants.js`](./constants.js), consider making it configurable, perhaps via extension options/storage, or by adding an initial API call to fetch the sub-task issue type ID dynamically.
3.  **Refine `manifest.json` Matches:** The `<all_urls>` match pattern in [`manifest.json`](./manifest.json) for the content script is very broad. Refine this to target only known Jira domains/URL patterns to improve performance and adhere to the principle of least privilege. This might require adding `host_permissions` explicitly.
4.  **Code Splitting/Dynamic Imports:** For larger extensions, consider code splitting or dynamic imports if the initial load of `content.js` and `app.jsx` becomes slow, although likely unnecessary for this project's current size.
5.  **TypeScript Conversion:** Consider converting JavaScript files (`.js`, `.jsx`) to TypeScript (`.ts`, `.tsx`) for improved type safety and maintainability, aligning with the project's stated technology stack in the main `codex.md`.

## Migration to Plasmo Framework

The project is intended to be migrated to the [Plasmo](https://www.plasmo.com/) framework to simplify development and build processes, aligning with the constraints defined in the main requirements document ([`../codex.md`](../codex.md)). Key migration steps include:

1.  **Project Setup:** Initialize a new Plasmo project or restructure the existing one according to Plasmo's directory conventions.
2.  **Manifest Conversion:** Replace the current [`manifest.json`](./manifest.json) with Plasmo's declarative approach, likely managed via `package.json` properties and Plasmo's build process. Browser-specific keys (`{{chrome}}`, `{{firefox}}`) will be handled by Plasmo.
3.  **Background Script:** Migrate [`background.js`](./background.js) logic to Plasmo's background script entry point (`background/index.ts` or similar). The current logic (listening for action clicks and sending messages) should map directly.
4.  **Content Script UI (CSUI):**
    *   Convert [`content.js`](./content.js) into a Plasmo Content Script UI component (`contents/jira-ui.tsx` or similar).
    *   Replace manual DOM querying (`getTargetElement`, `getView`) and injection (`togglePreactApp`, `createAppContainer`) with Plasmo's `getInlineAnchor` or equivalent methods to target Jira elements (`#ghx-detail-head`, `#stalker`).
    *   Leverage Plasmo's built-in Shadow DOM for style isolation instead of manual container creation.
    *   The Preact component [`app.jsx`](./app.jsx) will become the main export of the CSUI file.
    *   Messaging from the background script might be simplified using Plasmo's hooks or messaging utilities.
5.  **Build Process:** Remove the custom Vite configuration ([`../vite.config.js`](../vite.config.js)) and rely on Plasmo's CLI (`plasmo dev`, `plasmo build`).
6.  **TypeScript:** Perform the TypeScript conversion (Suggestion #5 above) during the migration, renaming files to `.ts`/`.tsx` and adding appropriate types.
7.  **Dependencies:** Update [`../package.json`](../package.json) to include `@plasmohq/storage`, `@plasmohq/messaging` (if needed), and other relevant Plasmo packages. Remove `vite-plugin-web-extension` and potentially `webextension-polyfill` if Plasmo provides alternatives.
8.  **Styling:** Ensure Tailwind CSS integration works correctly within Plasmo's build process (usually supported out-of-the-box or with minimal configuration). [`index.css`](./index.css) might be imported differently.