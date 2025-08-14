export default function getProjectVariables() {
  try {
    const currentUrl = new URL(window.location);
    const urlParams = new URLSearchParams(window.location.search);
    let parentIssueKey;
    let projectKey;

    // 1. Check for 'selectedIssue' or 'issueKey' in URL parameters (common on boards)
    parentIssueKey = urlParams.get("selectedIssue") || urlParams.get("issueKey");

    // 2. If not in params, check the URL path
    if (!parentIssueKey) {
      const pathParts = currentUrl.pathname.split("/");
      // Regex to find an issue key (e.g., ABC-123) in the path
      const issueKeyRegex = /^[A-Z][A-Z0-9]+-[1-9][0-9]*$/;
      const potentialIssueKey = pathParts[pathParts.length - 1];

      if (issueKeyRegex.test(potentialIssueKey)) {
        parentIssueKey = potentialIssueKey;
      }
    }

    // 3. As a fallback, try to find the issue key from the page content
    if (!parentIssueKey) {
      // Jira often stores issue info in meta tags
      const metaIssueId = document.querySelector('meta[name="ajs-issue-key"]');
      if (metaIssueId) {
        parentIssueKey = metaIssueId.getAttribute("content");
      }
    }
    
    // 4. Another fallback for some views (e.g. customer portal)
    if (!parentIssueKey) {
        const issueLink = document.querySelector('[data-issue-key]');
        if(issueLink) {
            parentIssueKey = issueLink.getAttribute('data-issue-key');
        }
    }

    if (!parentIssueKey) {
      throw new Error(
        "Could not determine the parent issue from the URL or page content."
      );
    }

    projectKey = parentIssueKey.split("-")[0];

    if (!projectKey) {
      throw new Error("Project key could not be determined from the issue key.");
    }

    return { parentIssueKey, projectKey };
  } catch (error) {
    // Re-throwing with a more informative structure
    throw new Error(`getProjectVariables failed: ${error.message}`);
  }
}