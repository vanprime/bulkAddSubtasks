export default function getProjectVariables() {
  try {
    const currentUrl = new URL(window.location);
    let parentIssue;
    let projectKey;

    if (currentUrl.pathname === "/secure/RapidBoard.jspa") {
      const urlParams = new URLSearchParams(window.location.search);
      parentIssue = urlParams.get("selectedIssue");
      if (!parentIssue)
        throw new Error("Selected issue not found in URL parameters.");
      projectKey = parentIssue.split("-")[0];
    } else if (
      currentUrl.pathname.startsWith("/browse/") ||
      currentUrl.pathname.startsWith("/projects/")
    ) {
      const pathParts = currentUrl.pathname.split("/");
      parentIssue = pathParts[pathParts.length - 1];
      if (!parentIssue) throw new Error("Issue key not found in URL path.");
      projectKey = parentIssue.split("-")[0];
    } else {
      throw new Error("URL does not match expected project or issue paths.");
    }

    if (!projectKey) throw new Error("Project key could not be determined.");

    return { parentIssue, projectKey };
  } catch (error) {
    throw { message: error.message };
  }
}
