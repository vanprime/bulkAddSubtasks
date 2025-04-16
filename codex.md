# Requirements Document: Jira Bulk Sub-task Adder Extension

**Version:** 1.0
**Date:** 2025-04-16

## 1. Introduction

### 1.1 Purpose
This document defines the requirements for the "Jira Bulk Sub-task Adder" browser extension. The primary purpose of this extension is to provide Jira users with a streamlined method for creating multiple sub-tasks under a parent issue directly from the Jira web interface, eliminating the need to create each sub-task individually through the standard Jira UI.

### 1.2 Scope
The extension will:
* Function within modern web browsers supporting Manifest V3 (initially targeting Google Chrome, potentially Firefox).
* Operate exclusively on web pages identified as belonging to a Jira instance (specifically targeting Backlog and Single Issue views).
* Interact with the Jira REST API (v3/latest) to fetch metadata and create issues.
* Be activated by the user via the browser's extension action button.
* Inject a user interface element onto the relevant Jira page for user interaction.

The extension will *not*:
* Provide general Jira issue management features beyond bulk sub-task creation.
* Store user credentials or API tokens independently (it relies on the browser's existing authenticated Jira session).
* Function offline.

### 1.3 Definitions, Acronyms, and Abbreviations
* **Jira:** Atlassian's issue tracking and project management software.
* **Issue:** A single unit of work tracked in Jira (e.g., Story, Bug, Task, Sub-task).
* **Sub-task:** An issue type typically used to break down a parent issue into smaller steps.
* **Parent Issue:** The Jira issue under which the bulk sub-tasks will be created.
* **Project Key:** A short identifier for a Jira project (e.g., "PROJ").
* **Issue Key:** A unique identifier for a Jira issue (e.g., "PROJ-123").
* **API:** Application Programming Interface.
* **REST:** Representational State Transfer.
* **CSUI:** Content Script User Interface (Plasmo feature).
* **UI:** User Interface.
* **DOM:** Document Object Model.
* **MV3:** Manifest Version 3 (Chrome Extension platform).

### 1.4 Overview
This document details the functional and non-functional requirements for the extension. Section 2 provides an overall description of the product, its features, users, and constraints. Section 3 specifies the detailed requirements, including functional behavior, UI characteristics, external API interactions, and quality attributes.

## 2. Overall Description

### 2.1 Product Perspective
The Jira Bulk Sub-task Adder is a browser extension that enhances the user experience of a target Jira instance. It acts as a client-side tool that interacts with the Jira web interface and its REST API. It is dependent on the structure of the Jira web pages for UI injection and the availability and behavior of the Jira REST API.

### 2.2 Product Features
* **UI Injection:** Dynamically adds an input panel to specific Jira views.
* **Context Detection:** Automatically identifies the parent issue and project from the current Jira page URL.
* **Bulk Input:** Allows users to enter multiple sub-task summaries efficiently.
* **API Interaction:** Communicates with the Jira REST API to fetch necessary metadata (issue types, fields, user info) and submit bulk creation requests.
* **Feedback Mechanism:** Provides visual feedback on progress, success, and errors during the creation process.
* **Automatic Refresh:** Reloads the Jira page upon successful creation to reflect the new sub-tasks.

### 2.3 User Classes and Characteristics
The primary user is any individual using Jira for project or task management who needs to create multiple sub-tasks for a given parent issue frequently. Users are expected to:
* Have an active, authenticated session within their Jira instance in the browser.
* Be familiar with basic Jira concepts (Projects, Issues, Sub-tasks).
* Have the necessary Jira permissions to create sub-tasks within the relevant projects.

### 2.4 Operating Environment
* **Browser:** Google Chrome (latest stable version supporting MV3). Potential compatibility with Firefox (latest stable version supporting MV3 equivalents).
* **Operating System:** Any OS supported by the target browsers (Windows, macOS, Linux).
* **Target Application:** Web-based Jira instances (Cloud or Server versions exposing the required REST API endpoints).

### 2.5 Design and Implementation Constraints
* **Technology Stack:** Must be developed using the Plasmo framework, React, and TypeScript. Styling must use Tailwind CSS.
* **Manifest Version:** Must adhere to Chrome's Manifest V3 requirements.
* **API Dependency:** Functionality is dependent on the specific endpoints and data structures of the Jira REST API (`/rest/api/latest/`). Changes in the API may require updates to the extension.
* **DOM Dependency:** UI injection relies on specific DOM element IDs or structures within the target Jira pages (`ghx-detail-head`, `stalker`, `page`). Changes in the Jira frontend may break UI injection.
* **Security:** Must operate within the security constraints of MV3 and browser extension permissions. API calls must rely on the user's existing browser authentication (e.g., cookies). Host permissions must be limited to necessary Jira domains.
* **Style Isolation:** UI elements injected onto the page must use Shadow DOM (provided by Plasmo CSUI) to prevent style conflicts with the host Jira page.

### 2.6 Assumptions and Dependencies
* The user is logged into their Jira instance in the browser where the extension is running.
* The user has the necessary permissions within Jira to view the parent issue and create sub-tasks in the associated project.
* The target Jira instance has the standard Sub-task issue type configured and enabled.
* The Jira REST API endpoints (`/myself`, `/issue/createmeta/...`, `/issue/bulk`) are available and function as expected.
* The DOM structure of the target Jira pages remains relatively stable.

## 3. Specific Requirements

### 3.1 Functional Requirements

**FR1: Activate Extension UI**
* **FR1.1:** The user shall be able to activate/toggle the extension's UI panel by clicking the extension's action icon in the browser toolbar.

**FR2: Inject UI onto Target Pages**
* **FR2.1:** When activated on a supported Jira page (Backlog view `/secure/RapidBoard.jspa`, Single Issue view `/browse/*` or `/projects/*`), the extension shall inject its UI panel into a predefined location within the page's DOM.
* **FR2.2:** The styling (margins) of the injected UI panel shall adapt based on the detected Jira view (Backlog vs. Single Issue).
* **FR2.3:** If the UI panel is already visible when the action icon is clicked, it shall be removed from the DOM.
* **FR2.4:** The extension shall not inject the UI if the current page is not identified as a supported Jira view.

**FR3: Parse Sub-task Input**
* **FR3.1:** The UI panel shall contain a text area where the user can input sub-task summaries.
* **FR3.2:** The extension shall parse the text area content, using the semicolon (`;`) as a delimiter to identify individual sub-task summaries.
* **FR3.3:** Leading/trailing whitespace for each parsed summary should be trimmed.
* **FR3.4:** Empty entries resulting from multiple semicolons or trailing semicolons shall be ignored.
* **FR3.5:** The UI shall display a real-time count of the valid sub-tasks parsed from the input.

**FR4: Determine Jira Context**
* **FR4.1:** Upon activation or before submission, the extension shall determine the parent issue key from the current page URL (e.g., from query parameters on Backlog view, or path segments on Issue view).
* **FR4.2:** The extension shall extract the project key from the determined parent issue key.
* **FR4.3:** If the parent issue or project key cannot be determined from the URL, an appropriate error shall be displayed (See FR12).

**FR5: Fetch Jira Metadata**
* **FR5.1:** Before submitting the creation request, the extension shall make an API call to the Jira `/issue/createmeta/{projectKey}/issuetypes/{subTaskId}` endpoint.
* **FR5.2:** The extension shall use a predefined ID for the sub-task issue type (currently hardcoded as `5`).
* **FR5.3:** The extension shall extract information about required fields for the sub-task issue type from the metadata response.

**FR6: Fetch Current User**
* **FR6.1:** Before submitting the creation request, the extension shall make an API call to the Jira `/myself` endpoint.
* **FR6.2:** The extension shall extract the current user's `name` (username) from the response to be used as the reporter for the new sub-tasks.

**FR7: Construct Bulk Issue Payload**
* **FR7.1:** For each valid sub-task summary parsed (FR3), the extension shall construct a JSON payload representing a Jira issue.
* **FR7.2:** Each issue payload shall include:
    * `fields.summary`: The parsed sub-task summary.
    * `fields.issuetype.id`: The predefined sub-task issue type ID.
    * `fields.project.key`: The determined project key (FR4.2).
    * `fields.parent.key`: The determined parent issue key (FR4.1).
    * `fields.reporter.name`: The current user's name (FR6.2).
* **FR7.3:** The extension shall iterate through the required fields identified in the metadata (FR5.3). If a required field is not already included in the payload (summary, issuetype, project, parent, reporter), the extension shall attempt to populate it using the first available value from the field's `allowedValues` in the metadata.
* **FR7.4:** If a required field cannot be automatically populated (e.g., no `allowedValues`), an error shall be raised and displayed (See FR12).
* **FR7.5:** The extension shall assemble the individual issue payloads into a single JSON structure suitable for the Jira `/issue/bulk` API endpoint (`{ "issueUpdates": [...] }`).

**FR8: Submit Bulk Request**
* **FR8.1:** The user shall initiate the bulk creation process by clicking the "Add Sub-Tasks" button.
* **FR8.2:** The button shall be disabled if no valid sub-tasks are entered in the text area (FR3.5 is 0) or if an error state exists.
* **FR8.3:** Upon clicking the button, the extension shall send a POST request to the Jira `/issue/bulk` API endpoint with the constructed payload (FR7.5).
* **FR8.4:** All API calls (FR5, FR6, FR8) shall be proxied through the extension's background service worker to handle potential CORS issues.

**FR9: Handle API Response**
* **FR9.1:** The extension shall handle successful responses (HTTP 2xx) from the `/issue/bulk` API call.
* **FR9.2:** The extension shall handle error responses (HTTP 4xx, 5xx) from any API call (FR5, FR6, FR8). Error details from the API response body should be captured if available.

**FR10: Update UI on Success**
* **FR10.1:** Upon successful completion of the bulk creation API call (FR9.1) and the progress bar animation (FR11.2), the extension shall clear the input text area.
* **FR10.2:** The extension shall trigger a reload of the current Jira web page.

**FR11: Display Progress Feedback**
* **FR11.1:** While the bulk creation process is active (from clicking the button until success/error), the "Add Sub-Tasks" button shall display a loading indicator (e.g., spinning icon) and be disabled.
* **FR11.2:** A progress bar shall visually indicate the stages of the process:
    * Stage 1: Context Determined (FR4)
    * Stage 2: Metadata Fetched (FR5)
    * Stage 3: User Info Fetched (FR6)
    * Stage 4: Payload Constructed (FR7)
    * Stage 5: API Request Submitted & Successful (FR8, FR9.1)
* **FR11.3:** The progress bar shall smoothly transition between stages.

**FR12: Display Error Feedback**
* **FR12.1:** If any error occurs during the process (e.g., context determination failure FR4.3, API call failure FR9.2, required field population failure FR7.4), the extension shall display a clear error message to the user within the UI panel.
* **FR12.2:** The error message should, where possible, include details from the API response or the nature of the failure.
* **FR12.3:** The "Add Sub-Tasks" button shall remain disabled while an error state is active.
* **FR12.4:** User input in the text area should clear the error state, allowing the user to attempt submission again.

### 3.2 User Interface (UI) Requirements
* **UI1:** The injected UI panel shall be clearly distinguishable but visually integrated with the Jira page.
* **UI2:** The UI shall consist of a multi-line text area, a button, a task count indicator, a progress bar, and an error message area.
* **UI3:** The layout shall be responsive and usable on typical desktop screen resolutions.
* **UI4:** Standard controls (text area, button) should behave predictably.
* **UI5:** Feedback elements (loading indicator, progress bar, error messages) shall be clearly visible when active.
* **UI6:** Styling shall primarily use Tailwind CSS utility classes.
* **UI7:** The UI shall be rendered within a Shadow DOM to prevent style clashes with the host Jira page.

### 3.3 External Interface Requirements
* **EI1: Jira REST API:**
    * **EI1.1:** The extension must interact with the following Jira REST API endpoints:
        * `GET /rest/api/latest/myself` (To get current user info)
        * `GET /rest/api/latest/issue/createmeta/{projectKey}/issuetypes/{issueTypeId}` (To get sub-task field metadata)
        * `POST /rest/api/latest/issue/bulk` (To create issues)
    * **EI1.2:** The extension must rely on the browser's existing authentication context (cookies) to authenticate API requests. It shall not handle credentials directly.
    * **EI1.3:** The extension must correctly format requests and parse responses according to the Jira REST API documentation for these endpoints.

### 3.4 Non-Functional Requirements
* **NFR1: Performance:**
    * **NFR1.1:** UI injection and initial rendering should occur promptly after activation.
    * **NFR1.2:** User input in the text area should feel responsive.
    * **NFR1.3:** API calls should be made asynchronously and provide visual feedback (loading state) to prevent the UI from appearing frozen.
* **NFR2: Security:**
    * **NFR2.1:** Extension permissions shall be minimized to only what is necessary (`activeTab`, `scripting`, `storage`, specific `host_permissions` for Jira domains).
    * **NFR2.2:** The extension must not store sensitive user data or credentials.
    * **NFR2.3:** API interactions must rely solely on the browser's established Jira session.
* **NFR3: Usability:**
    * **NFR3.1:** The interface should be simple and intuitive, requiring minimal learning.
    * **NFR3.2:** Feedback (task count, progress, errors, success) must be clear and timely.
    * **NFR3.3:** Error messages should be informative enough to help the user understand the problem.
* **NFR4: Reliability:**
    * **NFR4.1:** The extension should handle common errors (API errors, network issues, unexpected page structure) gracefully without crashing.
    * **NFR4.2:** The extension should consistently identify the correct parent issue context on supported pages.
* **NFR5: Maintainability:**
    * **NFR5.1:** Code shall be written in TypeScript using React and follow Plasmo framework conventions.
    * **NFR5.2:** Code should be well-commented and organized into logical modules (e.g., background, contents, components, utils).
    * **NFR5.3:** Use of Tailwind CSS should follow best practices for utility-first styling.
* **NFR6: Compatibility:**
    * **NFR6.1:** The extension must function correctly on the latest stable versions of Google Chrome.
    * **NFR6.2:** (Optional) The extension should strive for compatibility with the latest stable versions of Mozilla Firefox.